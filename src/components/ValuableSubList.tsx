import * as React from "react";
import {useEffect} from "react";
import {Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import SettingsIcon from "@mui/icons-material/Settings";
import relicUtils from "@/utils/relicUtils.ts";
import {toast} from "react-toastify";
import {AllSubStats} from "../../types.ts";

type ITestValuableSubListProps = {
    relicTitle: string;
    mainRelicStats: string;
    valuableSubStats: string[];
}

const ValuableSubList: React.FC<ITestValuableSubListProps> = (
    {
        relicTitle,
        mainRelicStats,
        valuableSubStats
    }) => {

    const [selectedStats, setSelectedStats] = React.useState(new Set(valuableSubStats));


    useEffect(() => {
        setSelectedStats(new Set(valuableSubStats));
    }, [valuableSubStats])


    const onSelectionChange = async (selectedKeys: Set<string>) => {
        console.log("selectedKeys", [...selectedKeys]);

        const result = await relicUtils.updateRelicRatingValuableSub(relicTitle, mainRelicStats, [...selectedKeys]);

        if (result.success) {
            // Update the state only after the successful update to ensure consistency
            setSelectedStats(new Set(selectedKeys)); // Update state if successful
            console.log(result.message)
        } else {
            toast(result.message, {type: "error"})
        }
    };


    return (
        <div className={"w-min mt-2"}>
            <Dropdown>
                <DropdownTrigger>
                    <div className="flex flex-row cursor-pointer gap-2">
                        <div className={"font-bold text-nowrap"}>
                            有效副属性
                        </div>
                        <SettingsIcon/>
                    </div>
                </DropdownTrigger>
                <DropdownMenu
                    variant="flat"
                    closeOnSelect={false}
                    selectionMode="multiple"
                    selectedKeys={selectedStats}
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
            <ul className={"flex flex-col gap-2 float-left mt-2"}>
                {[...selectedStats].map((valuableSubStat, index) => {
                    return <li key={index}>
                        <Chip color="success" variant="shadow" radius="sm">
                            {valuableSubStat}
                        </Chip>
                    </li>
                })}
            </ul>
        </div>
    )
}


export default ValuableSubList
