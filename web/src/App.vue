<template>
  <v-app>
    <v-navigation-drawer
      persistent
      clipped
      :value="true"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="true"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <Customers/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>Customers app</span>
    </v-footer>
  </v-app>
</template>

<script>
import Customers from './components/Customers'

export default {
  name: 'App',
  components: {
    Customers
  },
  data () {
    return {
      drawer: true,
      fixed: false,
      items: [{
        icon: 'account_box',
        title: 'Customers'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Customers'
    }
  }
}
</script>
