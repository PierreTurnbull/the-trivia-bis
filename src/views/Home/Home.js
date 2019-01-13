import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Home = ({ categoriesUnfinished, categoriesFinished }) => (
  <section className="game">
    <h1 className="title">My super quiz</h1>
    {/* categories unfinished */}
    {categoriesUnfinished.length > 0 && (
      <div>
        <h2 className="quizStatus">Available</h2>
        <ul>
          {categoriesUnfinished.map((category, key) => (
            <li className="quizCard" key={category.id}>
              <div className="quizCard-textContent">
                <p className="quizCard-title">{category.title}</p>
                <p className="quizCard-score">{localStorage[`${category.id}-currentQuestionIndex`] || 0} / {category.clues_count}</p>
              </div>
              <Link to={`/categories/${category.id}`}>
                <button className="btn start">Start</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* categories finished */}
    {categoriesFinished.length > 0 && (
      <div>
        <h2 className="quizStatus">Finished</h2>
        <ul>
          {categoriesFinished.map((category, key) => {
            const score = `Score : ${localStorage[`${category.id}-score`] || 0} / ${category.clues_count * 10}`

            return (
              <li className="quizCard" key={category.id}>
                <div className="quizCard-textContent">
                  <p className="quizCard-title">{category.title}</p>
                  <p className="quizCard-score">{score}</p>
                </div>
                <Link to={`/categories/${category.id}`}>
                  <button className="btn restart">Restart</button>
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