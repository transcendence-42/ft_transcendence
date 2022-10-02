import { mapNeon, mapOriginal } from '../conf/maps';

const MapSelect = (props: any) => {
  return (
    <table className="table-sm">
      <tbody>
        <tr className="text-center">
          <td>
            <h3 className="text-pink">Neon</h3>
          </td>
          <td>
            <h3 className="text-pink">Original</h3>
          </td>
        </tr>
        <tr>
          <td>
            <button
              className="btn"
              onClick={() => {
                props.closeHandler();
                props.setGameMap(mapNeon);
              }}
            >
              <img
                src="/img/neon.jpg"
                alt="Neon map"
                className="img-fluid"
                style={{ width: '200px' }}
              />
            </button>
          </td>
          <td>
            <button
              className="btn"
              onClick={() => {
                props.closeHandler();
                props.setGameMap(mapOriginal);
              }}
            >
              <img
                src="/img/original.jpg"
                alt="Original map"
                className="img-fluid"
                style={{ width: '200px' }}
              />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MapSelect;
