
"use client";
import {
  Button, Flex, Modal, Skeleton, Table,
  Text, Textarea, TextInput, 
  Badge,
  ActionIcon,
  Center
} from "@mantine/core";
import ListingCard from "../components/cards/ListingCard";
import { Plus, Trash, PencilLine } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
import { useUserContext } from "@/app/context/UserContext";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { toast, truncateStringAtMiddle } from "@/app/utils/helper";
import { useClient } from "@/app/utils/client";
import { Task, user_role } from "@/app/utils/types";
import { useState } from "react";
import NoDataFound from "@/app/components/NoDataFound";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePagination from "@/app/hooks/usePagination";

const TasksPage = () => {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const { user } = useUserContext()
  const queryClient = useQueryClient()
  const client = useClient()
  const [loading, setLoading] = useState(false)
  const isAdmin = user?.role === user_role.admin
  const [modalType, setModalType] = useState<"create" | "update" | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [deletingTask, setDeletingTask] = useState(false)

  const queryKeys = {
    tasks: ["taks", user?.id],
    members: ["team-members", user?.id]
  }

  const queryResults = useQueries({
    queries: [
      {
        queryKey: queryKeys.tasks,
        queryFn: async () => {
          try {
            const res = await client().get("/tasks/all")
            const result = res.data?.result as Task[]
            return result.map((item, idx) => ({ ...item, num: idx + 1 }))
          } catch (error) {
            //@ts-ignore
            toast(error?.response?.data?.message).error()
          }
        }
      },
      // {
      //   queryKey: queryKeys.members,
      //   queryFn: async () => {
      //     try {
      //       const res = await client().get("/users/team-members")
      //       const result = res.data?.result as User[]
      //       return result.map((item, idx) => ({ ...item, num: idx + 1 }))
      //     } catch (error) {
      //       toast(error?.respnse?.data?.message).error()
      //     }
      //   },
      //   enabled: isAdmin
      // }
    ]
  })

  const [{ data: tasks },
    // { data: teamMembers }
  ] = queryResults;
  const isLoading = queryResults.some(item => item.isLoading)
  const modalTypeIsCreate = modalType === "create";

  const handleCreateAndUpdateTask = async (task: Partial<Task & { prevTitle?: string }>) => {
    try {
      setLoading(true)
      const res = await client()[!modalTypeIsCreate ? "put" : "post"](modalTypeIsCreate ? "/tasks/create" : `/tasks/${selectedItem}`,
        {
          name: task.name,
          details: task?.details
        })
      const newTask = res?.data?.result as Task;

      queryClient.setQueryData(queryKeys.tasks,
        (data: Task[] | null) => {
          if (!data) return null;
          if (modalTypeIsCreate) {
            return [newTask, ...data].map((item, idx) => ({ ...item, num: idx + 1 }))
          } else {
            return data.map((item, idx) => item.id === selectedItem ?
              { ...newTask, num: idx + 1 } : { num: idx + 1, ...item })
          }
        })
      formik.resetForm()
      setLoading(false)
      close()
      toast(`Task ${modalTypeIsCreate ? "created" : "updated"} successfully!`).success()
    } catch (error) {
      setLoading(false)
     //@ts-ignore
     toast(error?.response?.data?.message).error()
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      details: "",
      prevTitle: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required().max(50).min(5),
      details: Yup.string().required().min(8).max(1000),
    }),
    onSubmit: handleCreateAndUpdateTask
  });

  const { values, touched, handleChange, handleSubmit, errors, handleBlur } = formik;

  const toggleModal = (modalType: "create" | "update" | null) => {
    setModalType(modalType)
    toggle()
  }

  const handleDelete = async (itemId: string) => {
    try {
      setSelectedItem(itemId)
      setDeletingTask(true)
      await client().delete(`/tasks/${itemId}`)
      queryClient.setQueryData(queryKeys.tasks,
        (data: Task[] | null) => {
          if (!data) return null;
          const itemIndex = data.findIndex(item => item.id === selectedItem)
          return itemIndex >= 0 ? data.filter(item => item.id !== itemId) : data

        })
      setSelectedItem(null)
      setDeletingTask(false)
      toast("Deleted successfully!").success()
    } catch (error) {
      setDeletingTask(false)
     //@ts-ignore
     toast(error?.response?.data?.message).error()
    }
  }

  const { PaginationBtn, data: paginatedData } = usePagination({
    data: tasks|| [],
    itemsPerPage: 10,
    withControls: true
  })

  return (
    <>
      {(isAdmin && !isLoading) && <Flex justify={"flex-end"} my={"sm"}>
        <Button
          onClick={() => toggleModal("create")}
          size="sm"
          leftSection={<Plus size={20} />}
          variant="filled">Add</Button>
      </Flex>}

      <ListingCard>
        {!isLoading ?
          <Table
            highlightOnHover
            striped="even"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>S/N</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            {(!!paginatedData?.length) ? <Table.Tbody>
              {paginatedData.map((item, idx) => (
                <Table.Tr key={idx}>
                  <Table.Td>
                    <Badge circle className="bg-primary">
                      {item?.num}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{item?.details}</Table.Td>
                  <Table.Td>
                    <ActionIcon variant="transparent" onClick={() => {
                      setSelectedItem(item.id)
                      formik.setValues({
                        details: item.details!,
                        name: item?.name,
                        prevTitle: item?.name
                      })
                      toggleModal("update")
                    }}>
                      <PencilLine size={20} color="gray" />
                    </ActionIcon>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="transparent"
                      loading={deletingTask && selectedItem === item.id}
                      onClick={() => handleDelete(item.id)}>
                      <Trash size={20} color="red" />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody> : null}
          </Table> : <>
            {Array(5).fill(null).map((item, key) => (
              <Skeleton
                className="w-full h-[50px] mb-[24px] last:mb-0"
                key={key} />
            ))}
          </>}
        {!isLoading && (tasks?.length === 0 ? <NoDataFound /> : 
        <Center my={"xl"}>
          <PaginationBtn />
        </Center>
        )}
      </ListingCard>

      {(opened && isAdmin) &&
        <Modal opened={opened && isAdmin}
          onClose={() => {
            close()
            if (selectedItem) {
              setSelectedItem(null)
            }
          }}
          title={modalTypeIsCreate ?
            <Text fw={600}>Create new task</Text> :
            <Flex direction={"column"}>
              <Text fw={600}>Edit Task</Text>
              <Text size="xs" c={"dimmed"}>{truncateStringAtMiddle(values.prevTitle!, 40)}</Text>
            </Flex>
          } centered>
          <form onSubmit={handleSubmit}>
            <TextInput
              withAsterisk
              value={values.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              label={"Title"}
              error={(touched.name && !!errors.name) ? errors?.name : null}
            />
            <Textarea
              withAsterisk
              minRows={3}
              maxRows={7}
              label={"Description"}
              onBlur={handleBlur("details")}
              mb={"xs"}
              value={values.details}
              onChange={handleChange("details")}
              error={(touched.details && !!errors.details) ? errors?.details : null}
            />
            <Flex className="justify-end">
              <Button type="submit"
                loading={loading}>
                Proceed</Button>
            </Flex>
          </form>
        </Modal>}
    </>
  );
}

export default TasksPage;