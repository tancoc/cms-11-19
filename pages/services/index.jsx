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

	const addMutation = useMutation((data) => api.create('/services', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('services')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Service added." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		addMutation.mutate({
			name: data.name,
			price: Number(data.price)
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
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.name}>
						<FormLabel>Price</FormLabel>
						<Input size="lg" {...register('price', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
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

const EditModal = ({ service }) => {
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

	const editMutation = useMutation((data) => api.update('/services', service._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('services')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Services updated." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		editMutation.mutate({
			name: data.name,
			price: Number(data.price)
		})
	}

	return (
		<Modal
			title="Edit Services"
			toggle={(onOpen) => (
				<MenuItem icon={<FiEdit2 size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Edit
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input size="lg" defaultValue={service?.name} {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.name}>
						<FormLabel>Price</FormLabel>
						<Input size="lg" defaultValue={service?.price} {...register('price', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
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

const DeleteModal = ({ service }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const deleteMutation = useMutation(() => api.remove('/services', service._id), {
		onSuccess: () => {
			queryClient.invalidateQueries('services')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Services deleted." />
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

const Services = () => {
	const { data: services, isFetched: isServicesFetched } = useQuery(['services'], () => api.all('/services'))

	return (
		<Container>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
					Services
				</Text>

				<AddModal />
			</Flex>

			<Card>
				<Table
					data={services}
					fetched={isServicesFetched}
					th={['Name', 'Price', , '']}
					td={(service, index) => (
						<Tr key={index}>
							<Td>{service.name}</Td>

							<Td>₱{service.price}</Td>

							<Td textAlign="right">
								<Menu placement="left-start">
									<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

									<MenuList>
										<EditModal service={service} />
										<DeleteModal service={service} />
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

Services.authentication = {
	authorized: 'Admin'
}

export default Services
