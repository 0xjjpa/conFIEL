import { Box, Container, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { Main } from "../components/Main";
import { Hero } from "../components/Hero";
import { useRef } from "react";

const Consumer = () => {
  const hiddenFileInput = useRef(null);

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      const body = new FormData();
      body.append("image", i);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Flex>
          <Text mr={2}>Upload .key</Text>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <IconButton
            onClick={handleClick}
            size="small"
            aria-label="file upload "
            icon={<ArrowUpIcon />}
          />
        </Flex>
      </Main>
    </Container>
  );
};

export default Consumer;
