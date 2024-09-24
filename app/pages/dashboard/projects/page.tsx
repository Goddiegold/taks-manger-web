
"use client";
import {
  Button, Flex, Modal, Skeleton, Table,
  Text, Textarea, TextInput,
  Badge,
  ActionIcon,
  MultiSelect,
  Center,
  TableScrollContainer,
  Tooltip,
  Group,
  Avatar,
  MultiSelectProps,
  Select,
  Timeline,
  ScrollArea
} from "@mantine/core";
import ListingCard from "../components/cards/ListingCard";
import { Plus, Trash, PencilLine, UserCirclePlus, Check, Scroll, FolderSimplePlus, ArrowsClockwise, HourglassMedium } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
import { useUserContext } from "@/app/context/UserContext";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { getInitials, toast, truncateStringAtMiddle } from "@/app/utils/helper";
import { useClient } from "@/app/utils/client";
import { AssignedProject, Project, User, user_role } from "@/app/utils/types";
import { useState } from "react";
import NoDataFound from "@/app/components/NoDataFound";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePagination from "@/app/hooks/usePagination";
import { formatDate, formatDistance, formatDistanceToNow } from "date-fns";

const ProjectPage = () => {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const { user } = useUserContext()
  const queryClient = useQueryClient()
  const client = useClient()
  const [loading, setLoading] = useState(false)
  const isAdmin = user?.role === user_role.admin
  const [modalType, setModalType] = useState<"create" | "update" | "assign" | "view-updates" | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [deletingTask, setDeletingTask] = useState(false)
  const [usersId, setUsersId] = useState<string[]>([])

  const queryKeys = {
    projects: ["projects", user?.id],
    members: ["team-members", user?.id],
    project_updates: ["project-updates", selectedProject?.id]
  }

  const modalTypeIsCreate = modalType === "create";
  const modalTypeIsUpdate = modalType === "update";
  const modalTypeIsAssign = modalType === "assign";
  const modalTypeIsViewUpdates = modalType === "view-updates";

  const queryResults = useQueries({
    queries: [
      {
        queryKey: queryKeys.projects,
        queryFn: async () => {
          try {
            const res = await client().get("/projects/all")
            if (isAdmin) {
              const result = res.data?.result as Project[]
              return result.map((item, idx) => {
                const assignments = item.assignments;
                return {
                  ...item,
                  num: idx + 1,
                  assignments: assignments.map((item: Partial<AssignedProject>) => item.userId) as string[]
                }
              })
            } else {
              const result = res.data?.result as AssignedProject[]
              return result.map((item, idx) => ({
                ...item,
                num: idx + 1,
                ...item.project,
                author: item.assignedBy,
              }))
            }
          } catch (error) {
            //@ts-ignore
            console.log(error)
            toast(error?.response?.data?.message).error()
          }
        }
      },
      {
        queryKey: queryKeys.members,
        queryFn: async () => {
          try {
            const res = await client().get("/users/team-members")
            const result = res.data?.result as User[]
            return result.map((item, idx) => ({ ...item, num: idx + 1 }))
          } catch (error) {
            //@ts-ignore
            toast(error?.response?.data?.message).error()
          }
        },
        enabled: isAdmin
      },
      {
        queryKey: queryKeys.project_updates,
        queryFn: async () => {
          try {
            const res = await client().get(`/projects/updates/${selectedProject.id}`)
            const result = res.data?.result as AssignedProject[]
            return result.map((item, idx) => ({ ...item, num: idx + 1 }))
          } catch (error) {
            //@ts-ignore
            toast(error?.response?.data?.message).error()
          }
        },
        enabled: isAdmin && !!selectedProject && modalTypeIsViewUpdates
      }
    ]
  })

  const [{ data: projects, isLoading: isLoading1 },
    { data: teamMembers, isLoading: isLoading2 },
    { data: projectUpdates, isLoading: isLoading3 }
  ] = queryResults;
  // const isLoading = queryResults.some(item => item.isLoading)
  const isLoading = isLoading1 || isLoading2;


  const handleCreateAndUpdateTask = async (project: Partial<Project & { prevTitle?: string }>) => {
    try {
      setLoading(true)
      const res = await client()[!modalTypeIsCreate ? "put" : "post"](modalTypeIsCreate ? "/projects/create" : `/projects/${selectedProjectId}`,
        {
          name: project.name,
          details: project?.details
        })
      const newProject = res?.data?.result as Project;

      queryClient.setQueryData(queryKeys.projects,
        (data: Project[] | null) => {
          if (!data) return null;
          if (modalTypeIsCreate) {
            return [{ ...newProject, assignments: [] }, ...data].map((item, idx) => ({ ...item, num: idx + 1 }))
          } else {
            return data.map((item, idx) => item.id === selectedProjectId ?
              { ...newProject, num: idx + 1, assignments: [] }
              : { num: idx + 1, ...item })
          }
        })
      formik.resetForm()
      setLoading(false)
      close()
      toast(`Project ${modalTypeIsCreate ? "created" : "updated"} successfully!`).success()
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

  const toggleModal = (modalType: "create" | "update" | "assign" | "view-updates" | null) => {
    setModalType(modalType)
    toggle()
  }

  const handleDelete = async (itemId: string) => {
    try {
      setSelectedProjectId(itemId)
      setDeletingTask(true)
      await client().delete(`/projects/${itemId}`)
      queryClient.setQueryData(queryKeys.projects,
        (data: Project[] | null) => {
          if (!data) return null;
          // const itemIndex = data.findIndex(item => item.id === selectedProjectId)
          // if (itemIndex !== -1) {
          return data.filter(item => item.id !== itemId);
          // }

        })
      setSelectedProjectId(null)
      setDeletingTask(false)
      toast("Deleted successfully!").success()
    } catch (error) {
      setDeletingTask(false)
      //@ts-ignore
      toast(error?.response?.data?.message).error()
    }
  }

  const { PaginationBtn, data: paginatedData } = usePagination({
    data: (projects || []) as unknown as Project[],
    itemsPerPage: 10,
    withControls: true,
    watchForUpdates: true,
  })

  const handleAssignUsersToProject = async () => {
    try {
      if (!selectedProjectId) return;
      setLoading(true)
      await client().post(`/projects/assign/${selectedProjectId}`, { usersId })
      queryClient.setQueryData(queryKeys.projects, (data: Project[] | null) => {
        if (!data) return null;
        return data.map((item, idx) =>
          item.id === selectedProjectId
            ? {
              ...item,
              assignments: Array.from(new Set([...item.assignments, ...usersId])),
              num: idx + 1
            }
            : { ...item, num: idx + 1 }
        );
      });
      setSelectedProjectId(null)
      setUsersId([])
      setLoading(false)
      close()
      toast("Assign users successfully").success()
    } catch (error) {
      setLoading(false)
      //@ts-ignore
      toast(error?.response?.data?.message).error()
    }
  }

  const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option, checked }) => {

    const getUser = () => {
      const user = teamMembers.find(item => item?.id === option?.value)
      return user;
    }

    const user = getUser()

    return (
      <Group gap="sm"
        onClick={() => console.log("i got selected", { ...option, checked })}
      >
        <Avatar
          size={36} radius="xl" >
          {getInitials(user?.name)}
        </Avatar>
        <div>
          <Text size="sm">{user?.name}</Text>
          <Text size="xs" opacity={0.5}>
            {user?.email}
          </Text>
        </div>
      </Group>
    );
  }

  const handleUpdateProjectStatus = async (itemId: string) => {
    if (isAdmin) return;
    try {
      setSelectedProjectId(itemId)
      setLoading(true)
      const res = await client().get(`/projects/update-status/${itemId}`)
      queryClient.setQueryData(queryKeys.projects, (data: Project[] | null) => {
        if (!data) return;
        return data.map(item => item.id === itemId ?
          { ...item, completed: true }
          : item)
      })
      setLoading(false)
      setSelectedProjectId(null)
      toast(res?.data?.message).success()
    } catch (error) {
      setLoading(false)
      setSelectedProjectId(null)
      //@ts-ignore
      toast(error?.response?.data?.message).error()
    }
  }

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
          <TableScrollContainer minWidth={500}>
            <Table
              highlightOnHover
              striped="even"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>S/N</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Description</Table.Th>
                  {isAdmin ? <>
                    <Table.Th></Table.Th>
                    <Table.Th></Table.Th>
                    <Table.Th></Table.Th>
                  </> :
                    <>
                      <Table.Th>Assigned By</Table.Th>
                    </>
                  }
                  <Table.Th>{isAdmin ? "Date added" : "Data assigned"}</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              {(!!paginatedData?.length) ? <Table.Tbody>
                {paginatedData.map((item, idx) =>

                (
                  <Table.Tr key={idx}>
                    <Table.Td>
                      <Badge circle className="bg-primary">
                        {item?.num}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {item.name}
                    </Table.Td>
                    <Table.Td>{item?.details}</Table.Td>
                    {isAdmin ? <>
                      <Table.Td>
                        <Tooltip
                          withArrow
                          label={`Count: ${item.assignments.length}`}>
                          <ActionIcon
                            variant="transparent"
                            onClick={() => {
                              setUsersId(item?.assignments as string[])
                              setSelectedProjectId(item.id)
                              toggleModal("assign")
                            }
                            }>
                            <UserCirclePlus size={20} />
                          </ActionIcon>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon variant="transparent" onClick={() => {
                          setSelectedProjectId(item.id)
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
                          loading={deletingTask && selectedProjectId === item.id}
                          onClick={() => handleDelete(item.id)}>
                          <Trash size={20} color="red" />
                        </ActionIcon>
                      </Table.Td>
                    </> : <Table.Td>
                      {item.author.name}
                    </Table.Td>}
                    <Table.Td>
                      <span>{formatDate(item.createdAt, "dd MMM, yyyy")}</span> at{" "}
                      <span>{formatDate(item.createdAt, "hh:mma")}</span>
                    </Table.Td>
                    <Table.Td>
                      {!isAdmin ?
                        <>
                          {
                            //@ts-ignore
                            !item?.completed ? <Tooltip label={"Mark as completed"} withArrow>
                              <ActionIcon variant="transparent"
                                onClick={() => {
                                  handleUpdateProjectStatus(item.id)
                                }}
                                loading={loading}>
                                <Check size={20} color="green" />
                              </ActionIcon>
                            </Tooltip> : <Badge color="green">completed</Badge>}
                        </> :
                        <Button variant="transparent"
                          onClick={() => {
                            // formik.setFieldValue("prevTitle", item.name)
                            setSelectedProject(item)
                            toggleModal("view-updates")
                          }}>view updates</Button>
                      }
                    </Table.Td>
                  </Table.Tr>
                )
                )}
              </Table.Tbody> : null}
            </Table>
          </TableScrollContainer>
          : <>
            {Array(5).fill(null).map((item, key) => (
              <Skeleton
                className="w-full h-[50px] mb-[24px] last:mb-0"
                key={key} />
            ))}
          </>}
        {!isLoading && (projects?.length === 0 ? <NoDataFound /> :
          <Center my={"xl"}>
            {projects?.length > 10 && <PaginationBtn />}
          </Center>
        )}
      </ListingCard>

      {(opened && isAdmin) &&
        <Modal
          scrollAreaComponent={ScrollArea.Autosize}
          opened={opened && isAdmin}
          classNames={{
            header: "!border-b mb-[10px]"
          }}
          onClose={() => {
            toggleModal(null)
            formik.resetForm()
            setUsersId([])
            if (selectedProjectId) setSelectedProjectId(null)
            if (selectedProject) setSelectedProject(null)
          }}
          title={modalTypeIsCreate ?
            <Text fw={600}>Create project</Text> :
            <Flex direction={"column"}>
              <Text fw={600}>{modalTypeIsUpdate ? "Edit project" : modalTypeIsAssign ? "Assign members" : "Updates"}</Text>
              <Text size="xs" c={"dimmed"}>{truncateStringAtMiddle(values.prevTitle! || selectedProject?.name, 40)}</Text>
            </Flex>
          } centered>

          {(modalTypeIsCreate || modalTypeIsUpdate) &&
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
                my={"xs"}
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
            </form>}

          {modalTypeIsAssign && <>
            <MultiSelect
              checkIconPosition="right"
              disabled={teamMembers?.length === 0}
              mb={"xs"}
              searchable
              multiple
              renderOption={renderMultiSelectOption}
              data={teamMembers?.map(item => ({ label: item.name, value: item.id }))}
              value={usersId}
              onChange={(value) => setUsersId(value)}
              hidePickedOptions
            />
            <Flex className="justify-end">
              <Button
                onClick={handleAssignUsersToProject}
                disabled={teamMembers?.length === 0 || usersId.length === 0}
                loading={loading}>
                Proceed</Button>
            </Flex>
          </>}


          {modalTypeIsViewUpdates && <>
            <Timeline
              active={1}
              bulletSize={24}
              lineWidth={2}>
              <Timeline.Item
                bullet={<FolderSimplePlus size={15} />}
                title={selectedProject.name}>
                <Text c="dimmed" size="sm">You created a new project.</Text>
                <Text size="xs" mt={4}>{formatDistanceToNow(selectedProject.createdAt || new Date(), { addSuffix: true })}</Text>
              </Timeline.Item>

              {!isLoading3 ? <>
                {projectUpdates && !!projectUpdates?.length && projectUpdates.map((item, idx) => (
                  <>
                    <Timeline.Item
                      key={idx}
                      title={<Badge
                        color={"blue"}>Assigned</Badge>}
                      bullet={<UserCirclePlus size={15} />}
                      lineVariant="dashed">
                      <Text c="dimmed" size="sm">{item?.user?.name} got assigned to this project by {item?.assignedBy?.name}</Text>
                      <Text size="xs" mt={4}>{formatDistanceToNow(item.createdAt || new Date(), { addSuffix: true })}</Text>
                    </Timeline.Item>
                    <Timeline.Item
                      key={idx}
                      title={<Badge color={item.completed ? "green" : "yellow"}>{item.completed ? "Updated" : "Pending"}</Badge>}
                      bullet={item.completed ? <ArrowsClockwise size={15} /> : <HourglassMedium size={15} />}
                      lineVariant="dashed">
                      <Text c="dimmed" size="sm">{item?.user?.name} {item.completed ? "has completed this project" : "hasn't completed this project"}</Text>
                      <Text size="xs" mt={4}>{formatDistanceToNow(item.updatedAt || new Date(), { addSuffix: true })}</Text>
                    </Timeline.Item>
                  </>
                ))}
              </> : <>
                {Array(5).fill(null).map((_, key) => (
                  <Timeline.Item
                    key={key}
                    lineVariant="dashed">
                    {Array(2).fill(null).map((_, key) => (
                      <Skeleton w={"100%"} h={30} mb={"xs"} key={key} />
                    ))}
                  </Timeline.Item>
                ))}
              </>}
            </Timeline>
          </>}

        </Modal>}
    </>
  );
}

export default ProjectPage;