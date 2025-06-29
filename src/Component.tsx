import { Button } from "./components/ui/button";

function Component() {
  return (
    <>
      <div className="hub:bg-black hub:h-screen hub:gap-5 hub:flex hub:flex-col hub:items-center hub:justify-center">
        <Button variant={"default"}>Olá mundo!</Button>
        <button className="hub:bg-primary hub:text-white">Olá mund 2o!</button>
      </div>
    </>
  );
}

export default Component;
