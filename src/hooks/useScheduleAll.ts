import {
	updateFavoritedConfessions,
	updateLikesAndDislikes,
	updateSharedConfessions,
	updateUnseenConfessions,
} from '@/services/confessionActions'
import useScheduleTask from './useScheduleTask'

const useScheduleAll = () => {
	useScheduleTask({ taskFunction: updateUnseenConfessions, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateLikesAndDislikes, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateSharedConfessions, period: 2 * 60 * 1000 })
	useScheduleTask({ taskFunction: updateFavoritedConfessions, period: 2 * 60 * 1000 })
}

export default useScheduleAll
