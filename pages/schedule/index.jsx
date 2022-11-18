import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Avatar, AvatarGroup, Badge, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiAlertTriangle, FiEdit2, FiEye, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const AddModal = () => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addMutation = useMutation((data) => api.create('/schedule', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('schedule')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Schedule added." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		addMutation.mutate({
			date: data.date,
			maximum: Number(data.maximum)
		})
	}

	return (
		<Modal
			title="Add Schedule"
			toggle={(onOpen) => (
				<Button colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Add New
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.date}>
						<FormLabel>Date</FormLabel>
						<Input type="date" size="lg" {...register('date', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.maximum}>
						<FormLabel>Maximum</FormLabel>

						<Select size="lg" {...register('maximum', { required: true })}>
							<option value={10}>10 Patients</option>
							<option value={20}>20 Patients</option>
							<option value={30}>30 Patients</option>
							<option value={40}>40 Patients</option>
							<option value={50}>50 Patients</option>
						</Select>
					</FormControl>

					<Flex align="center" gap={3}>
						<Button size="lg" w="full" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const ViewModal = ({ schedule, isScheduleFetched }) => {
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const disclosure = useDisclosure()
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	return (
		<Modal
			title={`${months[schedule.date.split('-')[1] - 1]} ${schedule.date.split('-')[2]}, ${schedule.date.split('-')[0]}`}
			size="lg"
			toggle={(onOpen) => (
				<MenuItem icon={<FiEye size={16} />} onClick={onOpen}>
					View
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<Flex direction="column" gap={6}>
				<Table
					data={schedule.patients}
					fetched={isScheduleFetched}
					th={['#', 'Full Name']}
					td={(sched, index) => (
						<Tr key={index}>
							<Td>{index + 1}</Td>

							<Td>
								{users
									.filter((user) => user._id === sched)
									.map((user) => (
										<Flex align="center" gap={3} key={user._id}>
											<Avatar name={user.name} src={user.image} />

											<Text fontWeight="medium" color="accent-1">
												{user.name}
											</Text>
										</Flex>
									))}
							</Td>
						</Tr>
					)}
					settings={{
						search: 'off',
						controls: 'off',
						show: [50]
					}}
				/>
			</Flex>
		</Modal>
	)
}

const EditModal = ({ schedule }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const editMutation = useMutation((data) => api.update('/schedule', schedule._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('schedule')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Schedule updated." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		editMutation.mutate({
			date: data.date,
			maximum: Number(data.maximum),
			status: data.status === 'true' ? true : false
		})
	}

	return (
		<Modal
			title="Edit Schedule"
			toggle={(onOpen) => (
				<MenuItem icon={<FiEdit2 size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Edit
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.date}>
						<FormLabel>Date</FormLabel>
						<Input type="date" defaultValue={schedule.date} size="lg" {...register('date', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.maximum}>
						<FormLabel>Maximum</FormLabel>

						<Select size="lg" defaultValue={schedule.maximum} {...register('maximum', { required: true })}>
							<option value={10}>10 Patients</option>
							<option value={20}>20 Patients</option>
							<option value={30}>30 Patients</option>
							<option value={40}>40 Patients</option>
							<option value={50}>50 Patients</option>
						</Select>
					</FormControl>

					<FormControl isInvalid={errors.status}>
						<FormLabel>Status</FormLabel>

						<Select size="lg" defaultValue={schedule.status} {...register('status', { required: true })}>
							<option value={true}>Open</option>
							<option value={false}>Closed</option>
						</Select>
					</FormControl>

					<Flex align="center" gap={3}>
						<Button size="lg" w="full" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const DeleteModal = ({ schedule }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const deleteMutation = useMutation(() => api.remove('/schedule', schedule._id), {
		onSuccess: () => {
			queryClient.invalidateQueries('schedule')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Schedule deleted." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)
		deleteMutation.mutate()
	}

	return (
		<Modal
			header="off"
			toggle={(onOpen) => (
				<MenuItem icon={<FiTrash2 size={16} />} onClick={onOpen}>
					Delete
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Flex bg="red.default" justify="center" align="center" borderRadius="full" h={24} w={24}>
					<Icon as={FiAlertTriangle} boxSize={10} color="white" />
				</Flex>

				<Flex align="center" direction="column" textAlign="center">
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Delete Schedule
					</Text>

					<Text>Are you sure you want to delete?</Text>
				</Flex>

				<Flex align="center" gap={3}>
					<Button size="lg" onClick={disclosure.onClose}>
						No, cancel
					</Button>

					<Button size="lg" colorScheme="red" isLoading={isLoading} onClick={onSubmit}>
						Yes, sure
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const Schedule = () => {
	const { data: schedule, isFetched: isScheduleFetched } = useQuery(['schedule'], () => api.all('/schedule'))
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	return (
		<Container>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
					Schedule
				</Text>

				<AddModal />
			</Flex>

			<Card>
				<Table
					data={schedule}
					fetched={isScheduleFetched && isUsersFetched}
					th={['Date', 'Patients', 'Maximum', 'Status', '']}
					td={(schedule, index) => (
						<Tr key={index}>
							<Td>
								{months[schedule.date.split('-')[1] - 1]} {schedule.date.split('-')[2]}, {schedule.date.split('-')[0]}
							</Td>

							<Td>
								<Flex align="center" gap={1}>
									<AvatarGroup>{schedule.patients.map((patient) => users.filter((user) => user._id === patient).map((user) => <Avatar name={user.name} src={user.image} key={user._id} />))}</AvatarGroup>
									{schedule.patients.length > 5 && <Text>+{schedule.patients.length - 5}</Text>}
								</Flex>
							</Td>

							<Td>
								<Text>{schedule.maximum} Patients</Text>
							</Td>

							<Td>
								<Badge variant="tinted" colorScheme={schedule.status ? 'brand' : 'red'}>
									{schedule.status ? 'Open' : 'Closed'}
								</Badge>
							</Td>

							<Td textAlign="right">
								<Menu placement="left-start">
									<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

									<MenuList>
										<ViewModal schedule={schedule} isScheduleFetched={isScheduleFetched} />
										<EditModal schedule={schedule} />
										<DeleteModal schedule={schedule} />
									</MenuList>
								</Menu>
							</Td>
						</Tr>
					)}
					settings={{
						search: 'off',
						controls: 'off'
					}}
				/>
			</Card>
		</Container>
	)
}

Schedule.authentication = {
	authorized: 'Admin'
}

export default Schedule
