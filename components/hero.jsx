import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Badge, Button, chakra, Divider, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import Modal from './_modal'
import Table from './_table'
import Toast from './_toast'

const BookModal = ({ session }) => {
	const queryClient = useQueryClient()
	const { data: schedule, isFetched: isScheduleFetched } = useQuery(['schedule'], () => api.all('/schedule'))
	const { data: services, isFetched: isServicesFetched } = useQuery(['services'], () => api.all('/services'))
	const disclosure = useDisclosure()
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const [selected, setSelected] = useState(null)
	const [image, setImage] = useState(null)
	const [imageURL, setImageURL] = useState(null)
	const [imageError, setImageError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addMutation = useMutation((data) => api.create('/appointment', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('appointment')
			setSelected('null')
			setImage(null)
			setImageURL(null)
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Your payment is on processing." />
			})
		}
	})

	const handleImage = (e) => {
		const file = e.target.files[0]

		if (!file) return setImageError('file does not exists.')
		if (file.size > 5120 * 5120) return setImageError('Largest image size is 5mb.')
		if (file.type !== 'image/jpeg' && file.type !== 'image/png') return setImageError('Image format is incorrect.')

		setImage(file)
	}

	const onSubmit = async (data) => {
		setIsLoading(true)

		if (!selected) {
			toast({
				position: 'top',
				render: () => <Toast title="Error" description="Please select your schedule!" status="error" />
			})

			setIsLoading(false)

			return
		}

		if (!image) {
			toast({
				position: 'top',
				render: () => <Toast title="Error" description="Proof of Payment is required!" status="error" />
			})

			setIsLoading(false)

			return
		}

		let res = null

		for (const item of [image]) {
			const formData = new FormData()

			formData.append('file', item)
			formData.append('upload_preset', 'uploads')

			res = await axios.post('https://api.cloudinary.com/v1_1/commence/image/upload', formData)
		}

		addMutation.mutate({
			userId: session.user.id,
			name: data.name,
			age: data.age,
			gender: data.gender,
			contact: data.contact,
			address: data.address,
			services: data.services,
			scheduleId: selected,
			proof: res.data.secure_url
		})
	}

	return (
		<Modal
			title="Book an Appointment"
			size="xl"
			toggle={(onOpen) => (
				<Button size="xl" colorScheme="brand" w={{ base: 'full', sm: 'auto' }} onClick={() => clearErrors() || reset() || onOpen()}>
					Book Now
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Full Name</FormLabel>
						<Input defaultValue={session.user.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Email Address</FormLabel>
						<Input defaultValue={session.user.email} size="lg" disabled />
					</FormControl>

					<Flex align="center" gap={6}>
						<FormControl>
							<FormLabel>Gender</FormLabel>

							<Select defaultValue={session.user.gender} size="lg" {...register('gender')}>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</Select>
						</FormControl>

						<FormControl isInvalid={errors.age}>
							<FormLabel>Age</FormLabel>
							<Input type="number" defaultValue={session.user.age} size="lg" {...register('age', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>

					<FormControl isInvalid={errors.contact}>
						<FormLabel>Mobile Number</FormLabel>
						<Input type="number" defaultValue={session.user.contact} size="lg" {...register('contact', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.address}>
						<FormLabel>Address</FormLabel>
						<Input defaultValue={session.user.address} size="lg" {...register('address', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Divider />

					<FormControl isInvalid={errors.services}>
						<FormLabel>Services</FormLabel>

						<Select placeholder="Select Services" size="lg" {...register('services', { required: true })}>
							{isServicesFetched &&
								services.map((service) => (
									<option value={service._id} key={service._id}>
										{service.name}
									</option>
								))}
						</Select>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Divider />

					<Flex direction="column" gap={2}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Schedule
						</Text>

						<Table
							data={schedule}
							fetched={isScheduleFetched}
							th={['Date', 'Patients', 'Status', '']}
							td={(schedule) => (
								<Tr key={schedule._id}>
									<Td>
										{months[schedule.date.split('-')[1] - 1]} {schedule.date.split('-')[2]}, {schedule.date.split('-')[0]}
									</Td>

									<Td>
										<Text>
											{schedule.patients.length}/{schedule.maximum}
										</Text>
									</Td>

									<Td>
										<Badge variant="tinted" colorScheme="blue">
											Open
										</Badge>
									</Td>

									<Td textAlign="right">{selected ? <IconButton size="xs" colorScheme="red" icon={<FiMinus size={12} />} onClick={() => setSelected(null)} /> : <IconButton size="xs" colorScheme="brand" icon={<FiPlus size={12} />} onClick={() => setSelected(schedule._id)} />}</Td>
								</Tr>
							)}
							filters={(data) => {
								return data.filter((data) => (selected ? data._id === selected : data.status))
							}}
							settings={{
								search: 'off',
								controls: 'off',
								show: [5]
							}}
						/>
					</Flex>

					<Divider />

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Total Amount
						</Text>

						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							₱200.00
						</Text>
					</Flex>

					<Divider />

					<FormControl isInvalid={errors.method}>
						<FormLabel>Payment Method</FormLabel>

						<Select size="lg" {...register('method', { required: true })}>
							<option>GCash</option>
						</Select>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.proof}>
						<FormLabel>Proof of Payment</FormLabel>

						<Input type="file" onChange={handleImage} />

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
						Book Now
					</Button>
				</Flex>
			</form>
		</Modal>
	)
}

const Hero = () => {
	const { data: session } = useSession()

	return (
		<chakra.section>
			<Flex align="center" gap={12} h={600}>
				<Flex flex={1} justify="start" align="center">
					<Flex align="start" direction="column" gap={6}>
						<Text fontSize={{ base: 64, xl: 80 }} fontWeight="bold" lineHeight={1} letterSpacing={0} color="accent-1">
							A better life starts with a <chakra.span color="brand.default">beautiful smile</chakra.span>
						</Text>

						<Text fontSize="lg">
							Everything in the world has beauty, but not everyone sees it.
							<br /> Every time you smile at someone, it is an act of love.
						</Text>

						{session ? (
							<BookModal session={session} />
						) : (
							<Button size="xl" colorScheme="brand" onClick={() => signIn('google')}>
								Book Now
							</Button>
						)}
					</Flex>
				</Flex>

				<Flex display={{ base: 'none', xl: 'flex' }} flex={1} justify="end" align="center">
					<chakra.div bgImage="url('/assets/hero.png')" bgRepeat="no-repeat" bgSize="contain" h="full" w="full">
						<chakra.svg width="144" height="600" viewBox="0 0 144 600" fill="none" xmlns="http://www.w3.org/2000/svg">
							<chakra.path d="M143.269 0L0 600V0H143.269Z" fill="system" />
						</chakra.svg>
					</chakra.div>
				</Flex>
			</Flex>
		</chakra.section>
	)
}

export default Hero
