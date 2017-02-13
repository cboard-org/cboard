var boardData = {
  boards:
  [
    {
      id: 'home',
      buttons: [
        { type: 'link', label: 'meals', text: 'i want to eat', img: 'images/mulberry-symbols/ready_meal.svg', link: 'meals', output: true },
        { type: 'link', label: 'snacks', text: 'i want a snack', img: '', link: 'snacks', output: true },
        { type: 'link', label: 'help', text: 'i need help', img: '', link: 'help', output: true },
        { type: 'link', label: 'feelings', text: '', img: '', link: 'feelings' },
        { type: 'link', label: 'orientation', text: '', img: '', link: 'orientation' },
        { type: 'button', label: 'hello', text: '', img: 'images/mulberry-symbols/hello.svg' },
        { type: 'button', label: 'bad', text: '', img: 'images/mulberry-symbols/bad.svg' },
        { type: 'button', label: 'good', text: '', img: 'images/mulberry-symbols/good.svg' },
        { type: 'button', label: 'yes', text: '', img: '' },
        { type: 'button', label: 'no', text: '', img: '' },
        { type: 'button', label: 'maybe', text: '', img: '' },
        { type: 'button', label: 'great', text: '', img: 'images/mulberry-symbols/great.svg' },
        { type: 'button', label: 'thank you', text: '', img: '' }
      ]
    },
    {
      id: 'meals',
      buttons: [
        { type: 'button', label: 'pasta', text: '', img: 'images/mulberry-symbols/pasta.svg' },
        { type: 'button', label: 'chicken', text: '', img: 'images/mulberry-symbols/chicken.svg' },
        { type: 'button', label: 'fish', text: '', img: 'images/mulberry-symbols/fish.svg' },
        { type: 'button', label: 'cereal', text: '', img: 'images/mulberry-symbols/cereal.svg' },
        { type: 'button', label: 'beef', text: '', img: 'images/mulberry-symbols/beef.svg' },
        { type: 'button', label: 'spaghetti bolognaise', text: '', img: 'images/mulberry-symbols/spaghetti_bolognaise.svg' },
        { type: 'link', label: 'soup', text: '', img: 'images/mulberry-symbols/soup.svg', link: 'soup' },
        { type: 'button', label: 'rice', text: '', img: 'images/mulberry-symbols/rice.svg' },
        { type: 'button', label: 'mashed potatoes', text: '', img: 'images/mulberry-symbols/mash_potato_1.svg' },
        { type: 'button', label: 'potatoes', text: '', img: 'images/mulberry-symbols/potato.svg' },
        { type: 'button', label: 'bread', text: '', img: 'images/mulberry-symbols/bread_slice.svg' },
        { type: 'button', label: 'croissant', text: '', img: 'images/mulberry-symbols/croissant.svg' },
        { type: 'button', label: 'boiled egg', text: '', img: 'images/mulberry-symbols/egg_boiled.svg' },
        { type: 'button', label: 'pizza', text: '', img: 'images/mulberry-symbols/pizza.svg' },
        { type: 'button', label: 'porridge', text: '', img: 'images/mulberry-symbols/porridge.svg' },
        { type: 'button', label: 'fried egg', text: '', img: 'images/mulberry-symbols/egg_fried.svg' },
        { type: 'button', label: 'salad', text: '', img: 'images/mulberry-symbols/salad.svg' },
        { type: 'button', label: 'hot dog', text: '', img: 'images/mulberry-symbols/hot_dog.svg' },
        { type: 'button', label: 'hamburger', text: '', img: 'images/mulberry-symbols/hamburger.svg' }
      ]
    },
    {
      id: 'soup',
      buttons: [
        { type: 'button', label: 'soup', text: '', img: 'images/mulberry-symbols/soup.svg' },
        { type: 'button', label: 'carrot soup', text: '', img: 'images/mulberry-symbols/soup_carrot.svg' },
        { type: 'button', label: 'chicken soup', text: '', img: 'images/mulberry-symbols/soup_chicken.svg' },
        { type: 'button', label: 'mushroom soup', text: '', img: 'images/mulberry-symbols/soup_mushroom.svg' },
        { type: 'button', label: 'onion soup', text: '', img: 'images/mulberry-symbols/soup_onion.svg' },
        { type: 'button', label: 'pea soup', text: '', img: 'images/mulberry-symbols/soup_pea.svg' },
        { type: 'button', label: 'tomato soup', text: '', img: 'images/mulberry-symbols/soup_tomato.svg' },
        { type: 'button', label: 'vegetable soup', text: '', img: 'images/mulberry-symbols/soup_vegetable.svg' }
      ]
    },
    {
      id: 'snacks',
      buttons: [
        { type: 'button', label: 'ice cream', text: '', img: 'images/mulberry-symbols/ice_cream.svg' },
        { type: 'button', label: 'chocolate', text: '', img: 'images/mulberry-symbols/chocolate.svg' },
        { type: 'link', label: 'fruit', text: '', img: 'images/mulberry-symbols/fruit.svg', link: 'fruit' },
        { type: 'button', label: 'crisps', text: '', img: 'images/mulberry-symbols/crisps.svg' },
        { type: 'button', label: 'marshmallows', text: '', img: 'images/mulberry-symbols/marshmallows.svg' },
        { type: 'button', label: 'milkshake', text: '', img: 'images/mulberry-symbols/milkshake.svg' },
        { type: 'button', label: 'pancakes', text: '', img: 'images/mulberry-symbols/pancakes.svg' },
        { type: 'button', label: 'biscuits', text: '', img: 'images/mulberry-symbols/biscuits.svg' }
      ]
    },
    {
      id: 'fruit',
      buttons: [
        { type: 'button', label: 'apple', text: '', img: 'images/mulberry-symbols/apple.svg' },
        { type: 'button', label: 'apricot', text: '', img: 'images/mulberry-symbols/apricot.svg' },
        { type: 'button', label: 'peach', text: '', img: 'images/mulberry-symbols/peach.svg' },
        { type: 'button', label: 'mango', text: '', img: 'images/mulberry-symbols/mango.svg' },
        { type: 'button', label: 'pear', text: '', img: 'images/mulberry-symbols/pear.svg' },
        { type: 'button', label: 'orange', text: '', img: 'images/mulberry-symbols/orange.svg' },
        { type: 'button', label: 'melon', text: '', img: 'images/mulberry-symbols/melon.svg' },
        { type: 'button', label: 'banana', text: '', img: 'images/mulberry-symbols/banana.svg' },
        { type: 'button', label: 'kiwi', text: '', img: 'images/mulberry-symbols/kiwi.svg' },
        { type: 'button', label: 'pineapple', text: '', img: 'images/mulberry-symbols/pineapple.svg' },
        { type: 'button', label: 'watermelon', text: '', img: 'images/mulberry-symbols/watermelon.svg' }
      ]
    },
    {
      id: 'orientation',
      buttons: [
        { type: 'button', label: 'up', text: '', img: 'images/mulberry-symbols/up.svg' },
        { type: 'button', label: 'down', text: '', img: 'images/mulberry-symbols/down.svg' },
        { type: 'button', label: 'left', text: '', img: 'images/mulberry-symbols/left.svg' },
        { type: 'button', label: 'right', text: '', img: 'images/mulberry-symbols/right.svg' },
        { type: 'button', label: 'above', text: '', img: 'images/mulberry-symbols/above.svg' },
        { type: 'button', label: 'below', text: '', img: 'images/mulberry-symbols/below.svg' },
        { type: 'button', label: 'on', text: '', img: 'images/mulberry-symbols/on.svg' },
        { type: 'button', label: 'under', text: '', img: 'images/mulberry-symbols/under_1.svg' }
      ]
    },
    {
      id: 'help',
      buttons: [
        { type: 'button', label: 'i am in pain', text: '', img: '' },
        { type: 'button', label: 'i am thirsty', text: '', img: 'images/mulberry-symbols/thirsty.svg' },
        { type: 'button', label: 'i am hungry', text: '', img: 'images/mulberry-symbols/hungry.svg' },
        { type: 'button', label: 'bathroom', text: 'i need to go to the bathroom', img: 'images/mulberry-symbols/need_toilet.svg' }
      ]
    },
    {
      id: 'feelings',
      buttons: [
        { type: 'button', label: 'i feel', text: '', img: '' },
        { type: 'button', label: 'you feel', text: '', img: '' },
        { type: 'button', label: 'happy', text: '', img: 'images/mulberry-symbols/happy_man.svg' },
        { type: 'button', label: 'sad', text: '', img: 'images/mulberry-symbols/sad_man.svg' },
        { type: 'button', label: 'angry', text: '', img: 'images/mulberry-symbols/angry_man.svg' },
        { type: 'button', label: 'afraid', text: '', img: 'images/mulberry-symbols/afraid_man.svg' },
        { type: 'button', label: 'disgusted', text: '', img: 'images/mulberry-symbols/disgusted_man.svg' }
      ]
    }
  ]
};

export default boardData;