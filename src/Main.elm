port module Main exposing (main)

-- JS Interop


port pingReceiver : (() -> msg) -> Sub msg


port sendPong : Int -> Cmd msg


type alias Flags =
    { environment : String }



-- Main


main : Program Flags Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init { environment } =
    ( initModel environment, Cmd.none )



-- Model


type alias Model =
    { environment : String
    , pingCount : Int
    }


initModel : String -> Model
initModel environment =
    { environment = environment
    , pingCount = 0
    }



-- Update


type Msg
    = ReceivedPing


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceivedPing ->
            let
                _ =
                    heavyComputation 1000000

                n =
                    model.pingCount + 1
            in
            ( { model | pingCount = n }, sendPong n )


heavyComputation : Int -> Int
heavyComputation n =
    List.range 0 n
        |> List.reverse
        |> List.map ((//) 3)
        |> List.reverse
        |> List.map ((+) 3)
        |> List.reverse
        |> List.sum



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions _ =
    pingReceiver (\() -> ReceivedPing)
