import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Category = ({ category, currentQuestionIndex, handleSubmit, answerInput, score, lives }) => {
  const currentQuestion = category.clues[currentQuestionIndex];
  return (
    <section className="game">
      <form className="quiz-selected" onSubmit={handleSubmit}>
        <h1 className="title">{category.title}</h1>
        <div className="question-container">
          <div className="question-info">
            <p className="question-lives">Li{lives > 1 ? 'ves' : 'fe'}: {lives}</p>
            <p className="question-score">Score : {score}</p>
          </div>
          <p className="question-text">{currentQuestion.question}</p>
          <div className="question-answer">
            {/* We give the ref below in order check the value */}
            <input className="question-input" ref={answerInput} placeholder="answer" />
            <button className="btn-submit" type="submit" title="Next"></button>
          </div>
        </div>
        <Link className="btn-back" to={`/`} key={category.id} title={'Go back to category list'}></Link>
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