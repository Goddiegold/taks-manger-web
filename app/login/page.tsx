"use client";
import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import AuthLayout from "../components/AuthLayout";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { At, Lock } from "@phosphor-icons/react";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (user: { email: string, password: string }) => {

  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required().max(50),
      password: Yup.string().required().min(8).max(50)
    }),
    onSubmit: handleLogin
  });

  const { values, touched, handleChange, handleSubmit, errors, handleBlur } = formik;



  return (
    <AuthLayout bottomContent={<Group justify="center" m={10}>
      <Text style={{ textAlign: "center" }} size="sm">
        Don&apos;t have an account yet?{" "}
        <Link
          href={"/register"}
          className="font-bold text-blue-400 no-underline"
        >
          Register
        </Link>
      </Text>
    </Group>}>
      <Text ta={"center"} my={"sm"} fw={600}>Login to your account</Text>
      <form method="POST"
        onSubmit={handleSubmit}
        autoComplete="on">
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
      </form>
    </AuthLayout>
  );
}

export default LoginPage;