import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Home = ({ categoriesUnfinished, categoriesFinished }) => (
  <section>
    <h1>Homepage</h1>
    {/* categories unfinished */}
    {categoriesUnfinished.length > 0 && (
      <div>
        <h2>Available quiz</h2>
        <ul>
          {categoriesUnfinished.map((category, key) => (
            <li key={category.id}>
              <Link to={`/categories/${category.id}`}>
                <p>{category.title} - progression: {localStorage[`${category.id}-currentQuestionIndex`] || 0} / {category.clues_count}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* categories finished */}
    {categoriesFinished.length > 0 && (
      <div>
        <h2>Finished quiz</h2>
        <ul>
          {categoriesFinished.map((category, key) => {
            const status = Number(localStorage[`${category.id}-lives`]) > 0 ? 'won' : 'lost'
            const score = `Score: ${localStorage[`${category.id}-score`] || 0} / ${category.clues_count * 10}`

            return (
              <li key={category.id}>
                <Link to={`/categories/${category.id}`}>
                  <p>{category.title} - {status} - {score} </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )}
  </section>
);

Home.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      clues_count: PropTypes.number
    }),
  ),
}

export default Home;