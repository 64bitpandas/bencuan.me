import { useEffect, useState } from "react";
import Button from "./button";
import "../sass/visitors.scss";

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


    const display = ((btnVisible) ? (
        <>
            {`> ${visitors} people were here before you`} <Button onClick={updateClaps} >🙋 hey i'm here too!</Button>
        </>
    ) : (
        <span className="including-you">
            {`> ${visitors} people were here including you :)`}
        </span>
    ));
    
    return (visitors) ? display : <></>
}

export default Visitors