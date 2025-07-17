import MainMenu from "../../components/MainMenu/MainMenu";
import PixelMap from "../../components/PixelMap/PixelMap";

export default function Main() {
    return (
        <div style={{ display: 'flex' }}>
            <MainMenu />
            <PixelMap/>
        </div>
    );
}
