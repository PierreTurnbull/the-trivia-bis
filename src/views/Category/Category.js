import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Category = ({ category, currentQuestionIndex, handleSubmit, answerInput, score, lives }) => {
  const currentQuestion = category.clues[currentQuestionIndex];
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>You chose: {category.title}</h1>
        <div className="question">
          <h3 className="question__title">
            {currentQuestion.question}
          </h3>
          <div className="question__answerInput">
            {/* We give the ref below in order check the value */}
            <input ref={answerInput} />
          </div>
          <button className="question__submit" type="submit">
            Next
          </button>
        </div>
        <p>Li{lives > 1 ? 'ves' : 'fe'}: {lives}</p>
        <p>Score: {score}</p>
        <Link to={`/`} key={category.id}>Go back to category list</Link>
      </form>
    </section>
  );
}

Category.propTypes = {
  category: PropTypes.shape({}).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  answerInput: PropTypes.shape({
    value: PropTypes.instanceOf(HTMLInputElement)
  }),
};

export default Category;