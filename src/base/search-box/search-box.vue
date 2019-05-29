<template>
  <div class="search-box">
    <!-- <i class="icon-search"></i> -->
    <input type="text" class="box" :placeholder="placeholder" v-model="query">
    <i class="icon-delete" v-show="query" @click="clear"></i>
    <!-- <span class="search" >{{clickInfo}}</span> -->
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    }
  },
  created() {
    this.$watch("query", newQuery => {
      this.$emit("query", newQuery);
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";

.search-box {
  // position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 25px;
  // border: 2px solid rgba(255, 255, 255, 0.6);
  // border-radius: 10px;
  border-bottom: 1px solid rgb(235, 235, 235);
  .icon-search {
    font-size: 24px;
    color: $color-text-g;
  }
  .box {
    flex: 1;
    line-height: 25px;
    background: $color-theme;
    color: #fff;
    font-size: $font-size-medium;
    border: none;
    outline: medium;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .icon-delete {
    position: absolute;
    right: 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    border: none;
  }
  .search {
    padding: 0 5px;
    font-size: 14px;
    color: $color-text;
  }
}
</style>
