"use client";
import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import AuthLayout from "@/app/components/AuthLayout";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { At, Lock } from "@phosphor-icons/react";
import client from "../../utils/client";
import { toast } from "@/app/utils/helper";
import { Action_Type, User } from "@/app/utils/types";
import { useUserContext } from "@/app/context/UserContext";


const RegisterPage = () => {

  const [loading, setLoading] = useState(false);
  const { userDispatch } = useUserContext()

  const handleRegister = async (user: Partial<User>) => {
    try {
      setLoading(true)
      const res = await client().post("/auth/register", { ...user })
      const userDetails = res?.data?.result as User
      const token = res.headers["authorization"]
      userDispatch({
        type: Action_Type.USER_PROFILE,
        payload: {
          ...userDetails,
          token
        }
      })
      toast(res?.data?.message).success()
      formik.resetForm()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast(error?.response?.data?.message).error()
    }
  };

  const formik = useFormik({
    initialValues: {
      name:"", 
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required().min(3),
      email: Yup.string().trim().email().required().max(50),
      password: Yup.string().required().min(8).max(50).trim()
    }),
    onSubmit: handleRegister
  });

  const { values, touched, handleChange, handleSubmit, errors, handleBlur } = formik;

  return (
    <AuthLayout bottomContent={<Group justify="center" m={10}>
      <Text style={{ textAlign: "center" }} size="sm">
        Already have an account?{" "}
        <Link
          href="/pages/login"
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
          onBlur={handleBlur("name")}
          value={values.name}
          onChange={handleChange("name")}
          leftSection={<At size={20} />}
          my={10}
          // h={40}
          required
          placeholder="Email Address"
          error={touched.name && errors.name ? errors.name : null}
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