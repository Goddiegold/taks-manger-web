"use client";
import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import AuthLayout from "../components/AuthLayout";


const RegisterPage = () => {
    return (  
        <AuthLayout>
          <Text ta={"center"} my={"sm"} fw={600}>Create an account</Text>
          <form method="POST" 
        //   onSubmit={handleSubmit}
           autoComplete="on">
        <TextInput
          label={"Name"}
        //   onBlur={handleBlur("email")}
        //   value={values.email}
        //   onChange={handleChange("email")}
        //   icon={<At size={20} />}
          my={10}
          // h={40}
          required
          placeholder="Email Address"
        //   error={touched.email && errors.email ? errors.email : null}
        />
        <TextInput
          label={"Email"}
        //   onBlur={handleBlur("email")}
        //   value={values.email}
        //   onChange={handleChange("email")}
        //   icon={<At size={20} />}
          my={10}
          // h={40}
          required
          placeholder="Email Address"
        //   error={touched.email && errors.email ? errors.email : null}
        />
        <PasswordInput
          label={"Password"}
        //   onBlur={handleBlur("password")}
        //   value={values.password}
        //   onChange={handleChange("password")}
        //   icon={<Lock size={20} />}
          required
          my={10}
          // h={40}
          placeholder="Password"
        //   error={touched.password && errors.password ? errors.password : null}
        />

        <Button
        //   loading={loading}
          className="bg-primary hover:bg-primary"
          fullWidth
          mt="xs"
          size="md"
          h={35}
          type="submit"
          radius="md"
        >
          Sign up
        </Button>
        {/* <Flex direction="row" justify="center" mt={15}>
          <Link
            to="/reset-password"
            className="mt-4 text-xs hover:underline"
          >
            Forgot password?
          </Link>
        </Flex> */}
      </form>
        </AuthLayout>
    );
}
 
export default RegisterPage;