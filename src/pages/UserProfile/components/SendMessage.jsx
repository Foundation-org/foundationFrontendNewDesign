import { useState } from "react";
import { Button } from "../../../components/ui/Button";

function SendMessage({ fdx }) {

    const [isPopup, setPopup] = useState(false);

    return (
        <Button variant="submit" className="mt-10" onClick={() => console.log("Set up popup")}>
            {`Send Message ${fdx} fdx`}
        </Button>
    )
}

export default SendMessage;
