import { chakra, Flex, Image, SimpleGrid, Text } from '@chakra-ui/react'
import Card from './_card'

const Services = () => {
	return (
		<chakra.section pt={100} id="services">
			<Flex direction="column" gap={12}>
				<Flex align="center" direction="column" textAlign="center">
					<Text fontSize={32} fontWeight="semibold" color="accent-1">
						Services
					</Text>

					<Text>Dental services that you can trust.</Text>
				</Flex>

				<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-4" src="/icons/4.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Consultation
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-5" src="/icons/5.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Tooth Extraction
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-6" src="/icons/6.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Restoration
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-7" src="/icons/7.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Oral Prophylaxis
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-8" src="/icons/8.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Removable Partial Denture
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-9" src="/icons/9.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Complete Denture
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-10" src="/icons/10.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Denture Repair
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-11" src="/icons/11.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Orthodontic Treatment
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex align="center" gap={6}>
							<Image boxSize={16} alt="icon-12" src="/icons/12.png" />

							<Text fontSize="lg" fontWeight="semibold" color="accent-1">
								Retainers
							</Text>
						</Flex>
					</Card>
				</SimpleGrid>
			</Flex>
		</chakra.section>
	)
}

export default Services
