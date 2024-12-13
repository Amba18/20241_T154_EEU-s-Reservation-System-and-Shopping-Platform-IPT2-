import { useEffect, useState } from 'react';
import classes from './foodsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';

export default function FoodsAdminPage() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const { searchTerm } = useParams();

  useEffect(() => {
    loadFoods();
  }, [searchTerm]);

  const loadFoods = async () => {
    const fetchedFoods = searchTerm ? await search(searchTerm) : await getAll();
    setFoods(fetchedFoods);
  };

  const FoodsNotFound = () => {
    if (foods && foods.length > 0) return null;

    return searchTerm ? (
      <NotFound linkRoute="/admin/foods" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
  };

  const handleDelete = async () => {
    if (!selectedFood) return;

    await deleteById(selectedFood.id);
    toast.success(`"${selectedFood.name}" has been removed!`);
    setFoods(foods.filter((food) => food.id !== selectedFood.id));
    setSelectedFood(null); // Close the modal
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Item Management" margin="1rem auto" />
        <Search
          searchRoute="/admin/foods/"
          defaultRoute="/admin/foods"
          margin="1rem 0"
          placeholder="Search Items"
        />
        <Link to="/admin/addFood" className={classes.add_food}>
          Add Item +
        </Link>
        <FoodsNotFound />
        {foods &&
          foods.map((food) => (
            <div key={food.id} className={classes.list_item}>
              <img src={food.imageUrl} alt={food.name} />
              <Link to={'/food/' + food.id}>{food.name}</Link>
              <Price price={food.price} />
              <div className={classes.actions}>
                <Link to={'/admin/editFood/' + food.id}>Edit</Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFood(food); // Open the modal with selected food
                  }}
                  className={classes.delete_button}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {/* Confirmation Modal */}
        {selectedFood && (
          <div className={classes.modal}>
            <div className={classes.modal_content}>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete "{selectedFood.name}"?</p>
              <div className={classes.modal_actions}>
                <button
                  onClick={() => setSelectedFood(null)}
                  className={classes.cancel_button}
                >
                  Cancel
                </button>
                <button onClick={handleDelete} className={classes.confirm_button}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
