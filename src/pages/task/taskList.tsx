import { KanbanBoardContainer, KanbanBoard } from "@/components/task/kanbanContainer";
import { KanbanColumn } from "@/components/task/kanbanColumn";
import {KanbanItem} from "@/components/task/kanbanItem"
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { TASKS_QUERY, TASK_STAGES_QUERY } from "@/graphql/queries";
import { useMemo } from "react";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { TaskStagesQuery, TasksQuery } from "@/graphql/types";
import { TaskCardMemo } from "@/components/task/taskCard";
import {KanbanAddCardButton} from '@/components/task/add-card-button'
import KanbanColumnSkeleton from "@/components/skeleton/kanban";
import ProjectCardSkeleton from "@/components/skeleton/project-card";
import { DragEndEvent } from "@dnd-kit/core";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";

const PageSkeleton = () => {
	const colCount = 6
	const itemCount = 4

	return (
		<KanbanBoardContainer>
			{Array.from({length: colCount}).map((_, idx) => {
				return (
					<KanbanColumnSkeleton 
						key={idx}
					>
						{Array.from({length: itemCount}).map((_, idx) => (
							<ProjectCardSkeleton 
								key={idx}
							/>
						))}	
					</KanbanColumnSkeleton>
				)
			})}
		</KanbanBoardContainer>
	)
}

type Task = GetFieldsFromList<TasksQuery>

type TaskStage = GetFieldsFromList<TaskStagesQuery> & {
	tasks: Task[]
}

export const TaskList = ({children}: React.PropsWithChildren) => {
	const {replace} = useNavigation()

	const {data: stages, isLoading: isLoadingStages} = useList<TaskStage>({
		resource: 'taskStages',
		meta: {
			gqlQuery: TASK_STAGES_QUERY
		},
		filters: [
			{
				field: 'title',
				operator: 'in',
				value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE']
			}
		],
		sorters: [
			{
				field: 'createdAt',
				order: 'asc'
			}
		]
	})

	const {data: tasks, isLoading: isLoadingTasks} = useList<GetFieldsFromList<TasksQuery>>({
		resource: 'tasks',
		meta: {
			gqlQuery: TASKS_QUERY
		},
		sorters: [
			{
				field: 'dueDate',
				order: 'asc'
			}
		],
		pagination: {
			mode: 'off'
		},
		queryOptions: {
			enabled: !!stages
		}
	})

	const {mutate: updateTask} = useUpdate()

	const taskStages = useMemo(() => {
		if(!tasks?.data || !stages?.data){
			return {
				unassignedStage: [],
				stages: []
			}
		}

		const unassignedStage = tasks.data.filter(task => task.stageId === null)

		const grouped: TaskStage[] = stages.data.map(stage => (
			{
				...stage,
				tasks: tasks.data.filter(task => task.stageId?.toString() === stage.id)
			}
		))

		return {
			unassignedStage,
			columns: grouped
		}
	}, [stages, tasks])

	const handleAddCard = (args: {stageId: string}) => {
		const path = args.stageId === 'unassigned' ? '/tasks/new' : `/tasks/new?stageId=${args.stageId}`
		
		replace(path)
	}

	const handleOnDragEnd = (e: DragEndEvent) => {
		let stageId = e.over?.id as undefined | string | null
		const taskId = e.active.id as string
		const taskStageId = e.active.data.current?.stageId

		if(taskStageId === stageId)
			return

		if(stageId === 'unassigened'){
			stageId = null
		}

		updateTask({
			resource: 'tasks',
			id: taskId,
			values: {
				stageId,
			},
			successNotification: false,
			mutationMode: 'optimistic',
			meta: {
				gqlMutation: UPDATE_TASK_STAGE_MUTATION
			}
		})

	}

	const isLoading = isLoadingStages || isLoadingTasks

	if(isLoading){
		return (<PageSkeleton />)
	}
		

	return (
		<>
			<KanbanBoardContainer>
				<KanbanBoard
					onDragEnd={handleOnDragEnd}
				>
					<KanbanColumn
						id='unassigned'
						title='unassigned'
						count={taskStages.unassignedStage.length || 0}
						onAddClick={() => handleAddCard({stageId: 'unassigned'})}
					>
						{taskStages.unassignedStage.map(task => (
							<KanbanItem
								key={task.id}
								id={task.id}
								data={
									{...task, stageId: 'unassigned'}
								}
							>
								<TaskCardMemo
									{...task}
									dueDate={task.dueDate || undefined} 
								/>
							</KanbanItem>
						))}
						{!taskStages.unassignedStage.length && (
							<KanbanAddCardButton
								onClick={() => handleAddCard({stageId: 'unassigned'})} 
							/>
						)}
					</KanbanColumn>
						
					{taskStages.columns?.map(c => (
						<KanbanColumn
							key={c.id}
							id={c.id}
							title={c.title}
							count={c.tasks.length}
							onAddClick={() => handleAddCard({
								stageId: c.id
							})} 
						>
							{!isLoading && c.tasks.map(task => (
								<KanbanItem
									key={task.id}
									id={task.id}
									data={task}
								>
									<TaskCardMemo
										{...task}
										dueDate={task.dueDate || undefined} 
									/>
								</KanbanItem>
							))}

							{!c.tasks.length  && (
								<KanbanAddCardButton
									onClick={() => handleAddCard({stageId: c.id})} 
								/>
							)}
						</KanbanColumn>
					))}
					
				</KanbanBoard>
			</KanbanBoardContainer>
			{children}
		</>
	)
};
