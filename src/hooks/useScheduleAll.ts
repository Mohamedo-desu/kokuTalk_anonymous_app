import { updateCommentLikesAndDislikes } from '@/services/commentActions'
import {
	updateConfessionLikesAndDislikes,
	updateFavoritedConfessions,
	updateSharedConfessions,
	updateUnseenConfessions,
} from '@/services/confessionActions'
import { updateReplyLikesAndDislikes } from '@/services/ReplyActions'
import useScheduleTask from './useScheduleTask'

const useScheduleAll = () => {
	useScheduleTask({ taskFunction: updateUnseenConfessions, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateConfessionLikesAndDislikes, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateSharedConfessions, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateFavoritedConfessions, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateCommentLikesAndDislikes, period: 1 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateReplyLikesAndDislikes, period: 1 * 60 * 1000 })
}

export default useScheduleAll
