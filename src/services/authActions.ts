import { supabase } from '@/utils/supabase'

export const signUpSupabase = async ({ userName, password, body }: any): Promise<any> => {
	try {
		const { data, error } = await supabase.auth.signUp({
			email: userName + '@kokutalk.user.com',
			password: password.trim(),
			options: {
				data: body,
			},
		})

		return {}
	} catch (error) {
		console.log(error)
	}
}
