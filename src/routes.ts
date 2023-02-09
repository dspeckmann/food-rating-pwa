import VueRouter from 'vue-router'
import HomePage from './pages/HomePage.vue'
import AddPetPage from './pages/AddPetPage.vue'
import EditPetPage from './pages/EditPetPage.vue'
import ListRatingsPage from './pages/ListRatingsPage.vue'
import AddRatingPage from './pages/AddRatingPage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import ListPetsPage from './pages/ListPetsPage.vue'
import CalendarPage from './pages/CalendarPage.vue'
import AcceptInvitationPage from './pages/AcceptInvitationPage.vue'
import ViewPetPage from './pages/ViewPetPage.vue'
import ListFoodsPage from './pages/ListFoodsPage.vue'

const routes: VueRouter.RouteRecordRaw[] = [
    { name: 'Homepage', path: '/', component: ListRatingsPage, meta: { title: 'Home' } },
    { name: 'Calendar', path: '/calendar', component: CalendarPage, meta: { title: 'Kalender' } },
    { name: 'ListPets', path: '/pets', component: ListPetsPage, meta: { title: 'Haustiere' } },
    { name: 'EditPet', path: '/pets/:id/edit', component: EditPetPage, props: true, meta: { title: 'Haustier bearbeiten' } },
    { name: 'ViewPet', path: '/pets/:id', component: ViewPetPage, props: true, meta: { title: 'Haustier' } },
    { path: '/pets/add', component: AddPetPage, meta: { title: 'Haustier hinzufügen' } },
    { name: 'AddRating', path: '/ratings/add', component: AddRatingPage, meta: { title: 'Futter bewerten' } },
    { name: 'Settings', path: '/settings', component: SettingsPage, meta: { title: 'Einstellungen' } },
    { name: 'AcceptInvitation', path: '/i/:id', component: AcceptInvitationPage, props: true, meta: { title: 'Einladung' } },
    { name: 'ListFoods', path: '/foods', component: ListFoodsPage, meta: { title: 'Futter' } }
]

export default routes