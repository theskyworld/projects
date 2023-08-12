import MusicList from "../../components/musicList/MusicList.vue";
import storage from "good-storage";
import { processSongs } from "../../service/song";
import { getSingerDetail } from "../../service/singer";

export default function createDetailComponent(name: any, key: any, fetch: any) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      };
    },
    computed: {
      computedData(): any {
        let ret = null;
        const data = (this as any).data;
        if (data) {
          ret = data;
        } else {
          const cached = storage.session.get(key);
          if (
            cached &&
            (cached.mid || cached.id + "") === (this as any).$route.params.id
          ) {
            ret = cached;
          }
        }
        return ret;
      },
      pic() {
        const data = this.computedData;
        return data && (data as any).pic;
      },
      title() {
        const data = this.computedData;
        return data && (data.name || (data as any).title);
      },
    },
    async created() {
      // const singerDetail = await getSingerDetail((this as any).data);
      // const res = await processSongs(singerDetail.songs);

      const data = (this as any).computedData;
      if (!data) {
        const path = (this as any).$route.matched[0].path;
        (this as any).$router.push({
          path,
        });
        return;
      }
      const result = await fetch(data);
      (this as any).songs = await processSongs(result.songs);
      (this as any).loading = false;
    },
  };
}
