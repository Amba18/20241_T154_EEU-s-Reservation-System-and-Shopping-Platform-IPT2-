import "./featured.scss";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  return (
    <div className="featured">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Product Sold</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mug</td>
            <td>23</td>
            <td>11-11-2024</td>
          </tr>
          <tr>
            <td>Jacket</td>
            <td>23</td>
            <td>11-11-2024</td>
          </tr>
          <tr>
            <td>Mug</td>
            <td>23</td>
            <td>11-11-2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Featured;
