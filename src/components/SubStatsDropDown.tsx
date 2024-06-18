import React from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {AllSubStats} from "../../types.ts";

type ISubStatsDropDownProps = {
    trigger: React.ReactNode;
    selectedKeys: Set<string>;
    onSelectionChange: (selectedKeys: Set<string>) => void;
}

const SubStatsDropDown: React.FC<ISubStatsDropDownProps> = (
    {
        trigger,
        selectedKeys,
        onSelectionChange
    }) => {
    return (
        <Dropdown>
            <DropdownTrigger>
                {trigger}
            </DropdownTrigger>
            <DropdownMenu
                variant="flat"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                // TODO: fix this type error
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                onSelectionChange={onSelectionChange}
                className={"max-h-60 overflow-y-auto"}
            >
                {
                    AllSubStats.map((stat) => {
                        return <DropdownItem key={stat}>{stat}</DropdownItem>
                    })
                }
            </DropdownMenu>
        </Dropdown>
    )

}
export default SubStatsDropDown;
