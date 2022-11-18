import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Avatar, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Image, Input, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const ViewModal = ({ appoint, users }) => {
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

	const addMutation = useMutation((data) => api.update('/appointment', appoint._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('appointment')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Request success." />
			})
		}
	})

	const rejectMutation = useMutation((data) => api.update('/appointment/reject', appoint._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('appointment')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Request success." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		addMutation.mutate(data)
	}

	const rejectPayment = (email) => {
		rejectMutation.mutate({})
	}

	return (
		<Modal header="off" toggle={(onOpen) => <IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={() => reset() || onOpen()} />} disclosure={disclosure}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					{users
						.filter((user) => user._id === appoint.patient.id)
						.map((user) => (
							<Flex align="center" direction="column" gap={6} p={6} key={user._id}>
								<Avatar boxSize={24} name={user.name} src={user.image} />

								<Flex align="center" direction="column" textAlign="center">
									<Text fontWeight="medium" color="accent-1">
										{user.name}
									</Text>

									<Text fontSize="sm" color="accent-1">
										{user.email}
									</Text>

									<Text mt={6} fontSize="lg" fontWeight="semibold" color="accent-1">
										{appoint._id}
									</Text>
								</Flex>
							</Flex>
						))}

					<FormControl isInvalid={errors.time}>
						<FormLabel>Set Time</FormLabel>
						<Input type="time" size="lg" {...register('time', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Flex direction="column" gap={2}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Payment Method
						</Text>

						<Input defaultValue="GCash" size="lg" readOnly />
					</Flex>

					<Flex direction="column" gap={2}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Proof of Payment
						</Text>

						<Image alt="proof of payment" src={appoint.proof} />
					</Flex>

					<Flex align="center" gap={6}>
						<Button size="lg" colorScheme="red" w="full" onClick={rejectPayment}>
							Reject
						</Button>

						<Button type="submit" size="lg" colorScheme="blue" w="full" isLoading={isLoading}>
							Accept
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const Dashboard = () => {
	const { data, isFetched } = useQuery(['appointment'], () => api.all('/appointment'))
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: schedule, isFetched: isScheduleFetched } = useQuery(['schedule'], () => api.all('/schedule'))
	const { data: services, isFetched: isServicesFetched } = useQuery(['services'], () => api.all('/services'))
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	return (
		<Container>
			<Flex>
				<Text fontSize="2xl" fontWeight="semibold" color="accent-1" mb={6}>
					Appointment
				</Text>
			</Flex>

			<Card>
				<Table
					data={data}
					fetched={(isFetched, isUsersFetched, isScheduleFetched)}
					th={['Patient', 'Appoint', 'Schedule', 'Time', '']}
					td={(data) => (
						<Tr key={data._id}>
							<Td maxW={200}>
								{users
									.filter((user) => user._id === data.patient.id)
									.map((user) => (
										<Flex align="center" gap={3} key={user._id}>
											<Avatar name={user.name} src={user.image} />

											<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
												{user.name}
											</Text>
										</Flex>
									))}
							</Td>

							<Td>
								{services
									.filter((service) => service._id === data.services)
									.map((service) => (
										<Text key={service._id}>
											{service.name} - {service.price}
										</Text>
									))}
							</Td>

							<Td>
								{schedule
									.filter((sched) => sched._id === data.schedule.id)
									.map((sched) => (
										<Text key={sched._id}>
											{months[sched.date.split('-')[1] - 1]} {sched.date.split('-')[2]}, {sched.date.split('-')[0]}
										</Text>
									))}
							</Td>

							<Td>
								<Text>{data.time ? data.time : 'not set'}</Text>
							</Td>

							<Td textAlign="right">
								<ViewModal appoint={data} users={users} />
							</Td>
						</Tr>
					)}
					select={(register) => (
						<Flex flex={1} justify="end" align="center" gap={3}>
							<Input type="date" size="lg" w="auto" />
						</Flex>
					)}
				/>
			</Card>
		</Container>
	)
}

Dashboard.authentication = {
	authorized: 'Admin'
}

export default Dashboard
