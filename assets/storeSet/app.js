//getting data
// function gettingData()
// {
//   db.collection('cafes').where('city', '==', 'Yogyakarta').orderBy('name').get().then((snapshot) => {
//     let i = 1;
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc, i);
//       ++i;
//     })
//   });
// }

//Realtime listener
let i = 1;
db.collection('cafes').orderBy('name').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == 'added') {
      renderCafe(change.doc, i);
      ++i;
    }else if (change.type == 'removed') {
      let list = $('[data-id='+ change.doc.id +']');
      list.closest('tr').remove();
      --i;
    }
  })
})

function renderCafe(doc, i)
{
  let id = doc.id;
  let results = $('#results');
  let list = $('<tr id="data"></tr>');
  let no = $('<td>'+ i +'</td>');
  let name = $('<td></td>');
  let city = $('<td></td>');
  let btnDel = $('<div id="btnDel" class="btn btn-sm btn-danger">Delete</div>');
  let del = $('<td></td>');

  results.append(list);
  list.append(no);
  list.append(name);
  list.append(city);
  del.append(btnDel);
  list.append(del);

  name.html(doc.data().name);
  city.html(doc.data().city);
  btnDel.attr('data-id', id);
  btnDel.on('click', (e) => {
    let id = btnDel.attr('data-id');
    db.collection('cafes').doc(id).delete();
    if (db.collection('cafes').doc(id).delete()) {
      console.log('Ok');
    }
  })
};

//saving data
$('#form').submit(function(e){
  e.preventDefault();
  let name = $('[name = name]').val();
  let city = $('[name = city]').val();
  db.collection('cafes').add({
    name: name,
    city: city
  });
  $('[name = name]').val('');
  $('[name = city]').val('');
})
