"use client";
import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import AuthLayout from "../components/AuthLayout";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { At, Lock } from "@phosphor-icons/react";


const RegisterPage = () => {

  const [loading, setLoading] = useState(false);

  const handleRegister = async (user: { email: string, password: string }) => {

  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required().min(3),
      email: Yup.string().email().required().max(50),
      password: Yup.string().required().min(8).max(50)
    }),
    onSubmit: handleRegister
  });

  const { values, touched, handleChange, handleSubmit, errors, handleBlur } = formik;

  return (
    <AuthLayout bottomContent={<Group justify="center" m={10}>
      <Text style={{ textAlign: "center" }} size="sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-blue-400 no-underline"
        >
          Login
        </Link>
      </Text>
    </Group>}>
      <Text ta={"center"} my={"sm"} fw={600}>Create an account</Text>
      <form method="POST"
        onSubmit={handleSubmit}
        autoComplete="on">
        <TextInput
          label={"Name"}
          onBlur={handleBlur("email")}
          value={values.email}
          onChange={handleChange("email")}
          leftSection={<At size={20} />}
          my={10}
          // h={40}
          required
          placeholder="Email Address"
          error={touched.email && errors.email ? errors.email : null}
        />
        <TextInput
          label={"Email"}
          onBlur={handleBlur("email")}
          value={values.email}
          onChange={handleChange("email")}
          leftSection={<At size={20} />}
          my={10}
          // h={40}
          required
          placeholder="Email Address"
          error={touched.email && errors.email ? errors.email : null}
        />
        <PasswordInput
          label={"Password"}
            onBlur={handleBlur("password")}
            value={values.password}
            onChange={handleChange("password")}
            leftSection={<Lock size={20} />}
          required
          my={10}
          // h={40}
          placeholder="Password"
          error={touched.password && errors.password ? errors.password : null}
        />

        <Button
            loading={loading}
          className="bg-primary hover:bg-primary"
          fullWidth
          mt={10}
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