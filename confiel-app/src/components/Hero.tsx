import { Flex, Link as ChakraLink, Heading } from '@chakra-ui/react'

export const Hero = ({ title }: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="100vh"
    my="10"
    marginTop="1rem"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
    zIndex="10"
  >
    <ChakraLink href="/">
      <Heading fontSize="6vw">{title}</Heading>
    </ChakraLink>
  </Flex>
)

Hero.defaultProps = {
  title: 'conFIEL CBDC',
}
