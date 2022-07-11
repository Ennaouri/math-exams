import React, { useState, useEffect } from 'react';
import { submitComment } from '../services';
import Style from "../styles/CommentsForm.module.css"

const CommentsForm = ({ slug }) => {
  const [error, setError] = useState(false);
  const [localStorage, setLocalStorage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ name: null, email: null, comment: null, storeData: false });

  useEffect(() => {
    setLocalStorage(window.localStorage);
    const initalFormData = {
      name: window.localStorage.getItem('name'),
      email: window.localStorage.getItem('email'),
      storeData: window.localStorage.getItem('name') || window.localStorage.getItem('email'),
    };
    setFormData(initalFormData);
  }, []);

  const onInputChange = (e) => {
    const { target } = e;
    if (target.type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [target.name]: target.value ,
      }));
    }
  };

  const handlePostSubmission = () => {
    setError(false);
    const { name, email, comment, storeData } = formData;
    if (!name || !email || !comment) {
      setError(true);
      return;
    }
    const commentObj = {
      name,
      email,
      comment,
      slug,
    };

    if (storeData) {
      window.localStorage.setItem('name', name);
      window.localStorage.setItem('email', email);
    } else {
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('email');
    }

    submitComment(commentObj)
      .then((res) => {
        if (res.createComment) {
          if (!storeData) {
            formData.name = '';
            formData.email = '';
          }
          formData.comment = '';
          setFormData((prevState) => ({
            ...prevState,
            ...formData,
          }));
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        }
      });
  };

  return (
    <form className={Style.div1} >
      <h3>Laisser un Commentaire</h3>
      <div className={Style.div2} /* "grid grid-cols-1 gap-4 mb-4" */>
        <textarea value={formData.comment || ""} onChange={onInputChange} className="p-4  w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" name="comment" placeholder="Comment" />
      </div>
      <div className={Style.div3}>
        <input type="text" value={formData.name || ""} onChange={onInputChange} placeholder="Name" name="name" />
        <input type="email" value={formData.email || ""} onChange={onInputChange}  placeholder="Email" name="email" />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <input checked={formData.storeData || false} onChange={onInputChange} type="checkbox" id="storeData" name="storeData" value="true" />{' '}
          <label className="text-gray-500 cursor-pointer" htmlFor="storeData"> Save my name, email in this browser for the next time I comment.</label>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">All fields are mandatory</p>}
      <div className="text-center">
        <button type="button" onClick={handlePostSubmission} className={Style.div4}>Envoyer</button>
        {showSuccessMessage && <span className={Style.div5} /* "text-xl float-right font-semibold mt-3 text-green-500" */>Commentaire En Cours de Supervision</span>}
      </div>
    </form>
  );
};

export default CommentsForm;