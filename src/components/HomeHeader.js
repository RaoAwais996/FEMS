import React from 'react';
import photo1 from '../images/workvacation.png';
import photo2 from '../images/vacations.png';
import photo3 from '../images/sickleave.png';
import photo4 from '../images/specialevent.png';
import './HomeHeader.css'; 

const HomeHeader = () => {
  const photos = [
    {
      id: 1,
      imageSrc: photo1,
      title: 'Work Travel',
    },
    {
      id: 2,
      imageSrc: photo2,
      title: 'Vacation',
    },
    {
      id: 3,
      imageSrc: photo3,
      title: 'Sick Leave',
    },
    {
      id: 4,
      imageSrc: photo4,
      title: 'Special Event' ,
    },
  ];

  return (
    <div className="home-header">


        
      {photos.map((photo) => (
        <div className="photo-item" key={photo.id}>
          <img src={photo.imageSrc} alt={photo.title} />
          <h3 >{photo.title}</h3>
          <p>{photo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HomeHeader;
