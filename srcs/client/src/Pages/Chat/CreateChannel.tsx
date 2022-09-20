export default function CreateChannel() {

    return (
        <>
            <label className="form-label">Name</label>
            <input type="name" className="form-control" placeholder="# channel-name"></input>
            <br></br>
            <ul className="list-group">
                <li className="list-group-item text-bg-dark bg-transparent">
                    <input className="form-check-input me-3 checkbox-style" type="checkbox"></input>
                    Make public
                </li>
                <li className="list-group-item text-bg-dark bg-transparent">
                    <input className="form-check-input me-3" type="checkbox"></input>
                    Make private
                </li>
                <li className="list-group-item text-bg-dark test bg-transparent">
                    <input className="form-check-input me-3" type="checkbox"></input>
                    Make protected with password
                </li>
            </ul>
        </>
    );
}