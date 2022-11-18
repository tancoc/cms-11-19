import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Container, Flex, Td, Text, Tr } from '@chakra-ui/react'
import Table from 'components/_table'
import Card from 'components/_card'

const Patients = () => {
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	console.log(users)

	return (
		<Container>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
					Patients
				</Text>
			</Flex>

			<Card>
				<Table
					data={users}
					fetched={isUsersFetched}
					th={['Full Name', 'Email Address', 'Age', 'Gender', 'Contact', 'Address', '']}
					td={(user, index) => (
						<Tr key={index}>
							<Td maxW={200}>
								<Flex align="center" gap={3}>
									<Avatar name={user.name} src={user.image} />

									<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
										{user.name}
									</Text>
								</Flex>
							</Td>

							<Td>
								<Text>{user.email}</Text>
							</Td>

							<Td>
								<Text>{user.age ? user.age : '-'}</Text>
							</Td>

							<Td>
								<Text>{user.gender ? user.gender : '-'}</Text>
							</Td>

							<Td>
								<Text>{user.contact ? user.contact : '-'}</Text>
							</Td>

							<Td>
								<Text>{user.address ? user.address : '-'}</Text>
							</Td>
						</Tr>
					)}
					filters={(data) => {
						return data.filter((data) => data.role === 'Patient')
					}}
				/>
			</Card>
		</Container>
	)
}

Patients.authentication = {
	authorized: 'Admin'
}

export default Patients
