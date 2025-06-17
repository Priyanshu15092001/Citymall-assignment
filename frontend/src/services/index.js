const URL = import.meta.env.VITE_BACKEND_URL;
export async function addMeme(form, tagsArray) {
  try {
    // console.log(form);

    const res = await fetch(`${URL}/memes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        image_url: form.image_url,
        tags: tagsArray,
      }),
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllMemes() {
  try {
    // console.log(form);

    const res = await fetch(`${URL}/memes`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function voteMeme(id, type) {
  try {
    const res = await fetch(`${URL}/memes/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({type}),
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function fetchLeaderboard() {
  try {
    
    const res = await fetch(`${URL}/leaderboard?top=10`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function updateBid(id,bid) {

  
  try {
    const res = await fetch(`${URL}/memes/${id}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({credits: parseInt(bid)}),
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateCaption(id) {
  try {
    const res = await fetch(`${URL}/memes/${id}/caption`, {
      method: "POST"
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
