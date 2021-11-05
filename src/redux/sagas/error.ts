import showPopup from "../../components/Popup";

export const handleError = (error: any) => {
    if (error.response) {
        console.debug("e.response status:" + error.response.status)
        let message = "";
        switch (error.response.status) {
            case 401:
                message = "Invalid data";
                break
            case 500:
                message = "Something went wrong on server"
                break
            case 404:
                message = "Object not found"
                break
            default:
                message = "Server unavailable";

        }
        showPopup({message: message, positiveButton: "ok"});

    }
}