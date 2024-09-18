"use client";
import { Button, Flex, Pagination } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { useMemo, useRef, useState } from "react";

type UsePaginationParams<T> = {
    data: T[];
    itemsPerPage?: number;
    withControls?: boolean;
    watchForUpdates?: boolean;
};


function usePagination<T>({ data, itemsPerPage = 5, withControls = false, watchForUpdates = false }: UsePaginationParams<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [previousDataLength, setPreviousDataLength] = useState(data.length);
    const isFirstRender = useRef(true);

    const totalPage = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

    useDidUpdate(
        () => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            if (!watchForUpdates) return;

            if (currentPage > totalPage) {
                setCurrentPage(totalPage > 0 ? totalPage : 1);
            }

            if (data.length > previousDataLength && data.length % itemsPerPage === 1) {
                setCurrentPage(totalPage);
            }

            setPreviousDataLength(data.length);
        },
        [data.length, totalPage, currentPage, watchForUpdates, itemsPerPage, previousDataLength]
    );

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [currentPage, data, itemsPerPage]);


    const disablePrevBtn = currentPage === 1;
    const disableNextBtn = totalPage === currentPage;

    const handlePrevBtn = () => {
        if (!disablePrevBtn) {
            setCurrentPage(prevValue => prevValue - 1);
        }
    };

    const handleNextBtn = () => {
        if (!disableNextBtn) {
            setCurrentPage(prevValue => prevValue + 1);
        }
    };

    const PaginationBtnHelper = () => (
        <Pagination
            withControls={withControls}
            color="purple"
            size="sm"
            value={currentPage}
            total={totalPage}
            onChange={setCurrentPage}
        />
    );

    const PaginationBtn = () => (
        <>
            {withControls ? (
                <PaginationBtnHelper />
            ) : (
                <Flex direction="row" align="center" className="sm:min-w-[250px] mt-[10px] lg:mt-0">
                    <Button
                        className="disable-btnHelper"
                        disabled={disablePrevBtn}
                        variant="transparent"
                        color="dark"
                        onClick={handlePrevBtn}
                    >
                        Previous
                    </Button>
                    <PaginationBtnHelper />
                    <Button
                        className="disable-btnHelper"
                        disabled={disableNextBtn}
                        color="dark"
                        variant="transparent"
                        onClick={handleNextBtn}
                    >
                        Next
                    </Button>
                </Flex>
            )}
        </>
    );

    return {
        PaginationBtn,
        data: paginatedData,
        startIndex: (currentPage - 1) * itemsPerPage + 1,
        endIndex: Math.min(currentPage * itemsPerPage, data.length),
        currentPage,
        setCurrentPage,
        disableNextBtn,
        disablePrevBtn,
        handleNextBtn,
        handlePrevBtn,
    };
}

export default usePagination;
