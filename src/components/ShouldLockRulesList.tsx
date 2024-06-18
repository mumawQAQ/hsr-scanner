import * as React from "react";
import {Chip, Radio, RadioGroup} from "@nextui-org/react";
import {Add, Delete} from "@mui/icons-material";
import SubStatsDropDown from "@/components/SubStatsDropDown.tsx";
import {toast} from "react-toastify";
import {RelicType} from "../../types.ts";
import useRelicStore from "@/store/relicStore.ts";

const Test = {
    contain: "1",
    include: {
        "1": new Set([RelicType.HP, RelicType.SPD]),
        "2": new Set([RelicType.CRITRate, RelicType.CRITDMG]),
    }
}

const ShouldLockRulesList: React.FC = () => {
    const {relicTitle, mainRelicStats, relicRatingInfo} = useRelicStore();

    const [isEditingContain, setIsEditingContain] = React.useState(false);
    const [containSelected, setContainSelected] = React.useState(Test.contain);
    const [includeSelected, setIncludeSelected] = React.useState<{
        [key: string]: Set<string>
    }>(Test.include);


    if (!relicTitle || !mainRelicStats || !relicRatingInfo?.shouldLock) {
        return null
    }


    return (
        <div className={"w-min h-fit flex flex-col justify-center"}>
            <div className={"font-bold text-nowrap"}>
                建议保留规则
            </div>
            <ul className={"flex flex-col gap-2 float-left mt-2"}>
                {
                    isEditingContain && (
                        <li>
                            <RadioGroup
                                className={"text-nowrap p-2"}
                                value={containSelected}
                                onValueChange={(value) => {
                                    setContainSelected(value)
                                    setIsEditingContain(false)
                                }}
                            >
                                <Radio value="1">包含1条有效属性</Radio>
                                <Radio value="2">包含2条有效属性</Radio>
                                <Radio value="3">包含3条有效属性</Radio>
                                <Radio value="4">包含4条有效属性</Radio>
                            </RadioGroup>
                        </li>
                    )
                }
                <li>
                    <div className="flex flex-row justify-center items-center">
                        <Chip
                            color={"success"}
                            radius={"sm"}
                            variant={"shadow"}
                            onClick={() => {
                                setIsEditingContain(true)
                            }}
                        >
                            包含{containSelected}条有效属性
                        </Chip>
                        <div>
                            <Delete color={"error"}/>
                        </div>
                    </div>
                </li>
                <li>
                    <div className={"flex flex-col gap-2 justify-center"}>
                        <ul className={"flex flex-col gap-2"}>
                            {
                                Object.keys(includeSelected).map((id) => {
                                    return <li key={id}
                                               className={"flex flex-row gap-1 align-middle justify-center"}>
                                        <SubStatsDropDown
                                            trigger={
                                                <Chip
                                                    color="success"
                                                    className={"cursor-pointer"}
                                                    radius="sm"
                                                    variant="shadow"
                                                >
                                                    同时拥有
                                                    <span className={"font-bold ml-1"}>
                                                    {[...includeSelected[id]].map((stat) => stat).join(" | ")}
                                                </span>
                                                </Chip>
                                            }
                                            selectedKeys={includeSelected[id]}
                                            onSelectionChange={(selectedKeys) => {
                                                // the includeSelected can't contain more than 4 sub stats
                                                if (selectedKeys.size > 4) {
                                                    toast("同时拥有的副属性不能超过4条", {type: "error"})
                                                    return
                                                }
                                                setIncludeSelected({
                                                    ...includeSelected,
                                                    [id]: selectedKeys
                                                })
                                            }}
                                        />
                                        <div onClick={
                                            () => {
                                                const newIncludeSelected = {...includeSelected}
                                                delete newIncludeSelected[id]
                                                setIncludeSelected(newIncludeSelected)
                                            }
                                        }>
                                            <Delete color={"error"} className={"cursor-pointer"}/>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <Chip
                        color="warning"
                        variant="shadow"
                        radius="sm"
                        startContent={<Add/>}
                        className={"cursor-pointer mt-3"}
                        onClick={() => {
                            setIncludeSelected({
                                ...includeSelected,
                                [Object.keys(includeSelected).length + 1]: new Set()
                            })
                        }}
                    >
                        添加新规则
                    </Chip>
                </li>
            </ul>
        </div>
    )
};

export default ShouldLockRulesList;
