import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const SelectOptions = (props: any) => {
  return (
    <>
      <table className="table-sm w-100">
        <tbody>
          <tr className="text-center">
            <td>
              <h3 className="text-pink">Normal effects</h3>
            </td>
            <td>
              <h3 className="text-pink">Super effects !</h3>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <button
                className="btn"
                onClick={() => {
                  props.closeHandler();
                }}
              >
                <AutoFixOffIcon className="text-blue fs-1 text-hover-pink" />
              </button>
            </td>
            <td className="text-center">
              <button
                className="btn"
                onClick={() => {
                  props.closeHandler();
                  props.socket.emit('updateOptions', {
                    id: props.gameId,
                    effects: true,
                  });
                }}
              >
                <AutoFixHighIcon className="text-blue fs-1 text-hover-pink" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default SelectOptions;
