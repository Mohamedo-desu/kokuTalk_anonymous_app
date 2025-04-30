import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// Webhook handler for Clerk events:
// - user.created: Creates a new user in the database
// - user.deleted: Deletes the user's data from the database
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error(
        'Missing webhook secret. Please set CLERK_WEBHOOK_SECRET in your .env.local file.'
      );
    }

    //   CHECK HEADERS
    const svix_id = request.headers.get('svix-id');
    const svix_signature = request.headers.get('svix-signature');
    const svix_timestamp = request.headers.get('svix-timestamp');

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response('Missing svix headers', {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt: any;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as any;
    } catch (error) {
      console.error('Error verifying webhook', error);
      return new Response('Error occurred', {
        status: 400,
      });
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, unsafe_metadata } = evt.data;

      const email = email_addresses[0].email_address;
      const { username } = unsafe_metadata;

      try {
        await ctx.runMutation(internal.users.createUser, {
          email,
          clerkId: id,
          username: username ? username : email.split('@')[0],
        });
      } catch (error) {
        console.log('Error creating user', error);
        return new Response('Error occurred', {
          status: 500,
        });
      }
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;

      try {
        await ctx.runMutation(internal.users.deleteUserData, {
          clerkId: id,
        });
        console.log(`Processed user.deleted webhook for Clerk ID: ${id}`);
      } catch (error) {
        console.error('Error deleting user data', error);
        return new Response('Error deleting user data', {
          status: 500,
        });
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  }),
});

export default http;
