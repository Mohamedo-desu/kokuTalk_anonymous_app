import { v } from 'convex/values';
import { internalMutation, mutation } from './_generated/server';

// Generate a URL for file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async ctx => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Delete a file from storage
export const deleteFile = internalMutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});

// Get a URL to download a file
export const getDownloadUrl = internalMutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
