import { Button, Flex, Modal, Table, Text } from "@mantine/core";
import ListingCard from "../components/cards/ListingCard";
import { Plus } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";

const TeamManagement = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];
    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
        </Table.Tr>
    ));
    return (
        <>
            <Flex justify={"flex-end"} my={"sm"}>
                <Button
                    onClick={open}
                    size="sm"
                    leftSection={<Plus size={20} />}
                    variant="filled">Add</Button>
            </Flex>
            <ListingCard>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Element position</Table.Th>
                            <Table.Th>Element name</Table.Th>
                            <Table.Th>Symbol</Table.Th>
                            <Table.Th>Atomic mass</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ListingCard>

            <Modal opened={opened}
                onClose={close}
                title={<Text fw={600}>Create new task</Text>} centered>
                {/* Modal content */}
            </Modal>
        </>
    );
}

export default TeamManagement;