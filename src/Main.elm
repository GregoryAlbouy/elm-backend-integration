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
    ( initModel (Debug.log "Elm environment" environment), Cmd.none )



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


addPing : Model -> Model
addPing model =
    { model | pingCount = model.pingCount + 1 }



-- Update


type Msg
    = ReceivedPing ()
    | SendPong Int


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceivedPing _ ->
            ( model |> addPing, sendPong (model.pingCount + 1) )

        SendPong n ->
            ( model, sendPong n )



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions _ =
    pingReceiver ReceivedPing
