import { useEffect, useState } from "react";
import Button from "./button";

const Visitors = () => {
    const [visitors, setVisitors] = useState("");
    const [btnVisible, setBtnVisible] = useState(true);

    async function getVisitors() {
        const res = await fetch('https://api.bencuan.me/get-claps');
        setVisitors(await res.text());
        console.log(visitors);
    }
    useEffect(() => {
        getVisitors();
    })

    const updateClaps = () => {
        fetch('https://api.bencuan.me/update-claps', {
            method: "POST",
        });
        getVisitors();
        setBtnVisible(false);
    }


    const display = (<>
        {`> ${visitors} people were here ${(btnVisible) ? 'before you' : 'including you!'}`} <Button onClick={updateClaps} className={(btnVisible ? "" : "hidden")}>i was here too!</Button>
    </>)

    return (visitors) ? display : <></>
}

export default Visitors