import { Card } from "@mantine/core";
import { ReactNode } from "react";

interface ListingCardProps {
    children: ReactNode
}

const ListingCard: React.FC<ListingCardProps> = ({ children }) => {
    return (
        <Card shadow="sm" mih={400} withBorder>
            {children}
        </Card>
    );
}

export default ListingCard;