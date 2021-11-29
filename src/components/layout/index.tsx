import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" maxWidth={1000} transition="0.5s ease-out">
      <Box margin="8">
        <Header />
        <Box as="main" marginY={22} minHeight="100vh">
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
