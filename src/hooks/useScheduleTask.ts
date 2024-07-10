import { useEffect } from 'react'

const useScheduleTask = ({
	taskFunction,
	period,
}: {
	taskFunction: () => void
	period: number
}) => {
	useEffect(() => {
		taskFunction()

		const intervalId = setInterval(() => {
			taskFunction()
		}, period)

		return () => clearInterval(intervalId)
	}, [taskFunction, period])
}

export default useScheduleTask
