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
	useScheduleTask({ taskFunction: updateUnseenConfessions, period: 0.1 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateConfessionLikesAndDislikes, period: 0.1 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateSharedConfessions, period: 0.1 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateFavoritedConfessions, period: 0.1 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateCommentLikesAndDislikes, period: 0.1 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateReplyLikesAndDislikes, period: 0.1 * 60 * 1000 })
}

export default useScheduleAll
